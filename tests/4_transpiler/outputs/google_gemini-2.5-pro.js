const bundleApp = async (entryFile, files) => {
  const Babel = (await import('https://cdn.jsdelivr.net/npm/@babel/standalone@7/babel.min.js')).default;

  const resolvePath = (base, relative) => {
    if (!/^\./.test(relative)) return relative;
    const stack = base.split('/').slice(0, -1);
    relative.split('/').forEach(part => {
      if (part === '..') stack.pop();
      else if (part !== '.') stack.push(part);
    });
    return stack.join('/');
  };

  const modules = [];
  const moduleMap = new Map();

  const createModule = async (filename) => {
    if (moduleMap.has(filename)) return moduleMap.get(filename);

    const code = files[filename];
    if (code === undefined) throw new Error(`File not found: ${filename}`);

    const id = modules.length;
    moduleMap.set(filename, id);
    modules.push(null);

    const { code: transformedCode } = Babel.transform(code, { presets: ['env'] });
    const depRegex = /(?<![.\w$])require\s*\(['"]([^'"]+)['"]\)/g;
    const dependencies = [...transformedCode.matchAll(depRegex)].map(m => m[1]);

    const mapping = {};
    await Promise.all(dependencies.map(async depPath => {
      const absPath = resolvePath(filename, depPath);
      mapping[depPath] = await createModule(absPath);
    }));

    modules[id] = { code: transformedCode, mapping };
    return id;
  };

  const entryId = await createModule(entryFile);

  const moduleDefs = modules.map(
    ({ code, mapping }) => `[function(require,module,exports){${code}},${JSON.stringify(mapping)}]`
  ).join(',');

  return `(function() {
  const modules = [${moduleDefs}];
  const cache = {};
  const require = id => {
    if (cache[id]) return cache[id].exports;
    const [fn, mapping] = modules[id];
    const module = cache[id] = { exports: {} };
    fn(path => require(mapping[path]), module, module.exports);
    return module.exports;
  };
  return require(${entryId});
})()`;
};
export default bundleApp;