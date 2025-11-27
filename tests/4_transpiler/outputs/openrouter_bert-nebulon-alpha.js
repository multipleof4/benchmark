const bundleApp = async (entryFile, files) => {
  const babel = await import('https://unpkg.com/@babel/standalone/babel.min.js');
  const graph = {};
  const visited = new Set();

  const traverse = async (filename) => {
    if (visited.has(filename)) return;
    visited.add(filename);

    if (!files[filename]) throw new Error(`File not found: ${filename}`);

    const transformed = babel.transform(files[filename], {
      presets: ['env'],
      filename
    }).code;

    const deps = [];
    const requireRegex = /require\(['"](.*?)['"]\)/g;
    let match;

    while ((match = requireRegex.exec(transformed)) !== null) {
      deps.push(match[1]);
    }

    graph[filename] = { code: transformed, deps };
    await Promise.all(deps.map(dep => traverse(resolvePath(filename, dep))));
  };

  const resolvePath = (from, to) => {
    if (to.startsWith('.')) {
      const fromDir = from.split('/').slice(0, -1).join('/');
      return `${fromDir}/${to}`.replace(/\/\.\//g, '/').replace(/[^/]+\/\.\.\//g, '');
    }
    return to;
  };

  await traverse(entryFile);

  const modules = Object.entries(graph).map(([id, { code }]) => {
    return `'${id}': {
      exports: {},
      fn: function(require, module, exports) {
        ${code}
      }
    }`;
  }).join(',');

  return `(function() {
    const modules = {${modules}};
    const cache = {};

    function require(moduleId) {
      if (cache[moduleId]) return cache[moduleId].exports;
      const module = cache[moduleId] = modules[moduleId];
      module.fn(require, module, module.exports);
      return module.exports;
    }

    return require('${entryFile}');
  })();`;
};
export default bundleApp;