async function bundleApp(entryFile, files) {
  const { transform } = await import('https://unpkg.com/@babel/standalone/babel.min.js');
  
  const modules = {};
  const visited = new Set();
  
  const normalizePath = (path) => {
    return path.replace(/^\.\//, '').replace(/\.js$/, '') + '.js';
  };
  
  const extractRequires = (code) => {
    const requires = [];
    const regex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    let match;
    while ((match = regex.exec(code)) !== null) {
      requires.push(match[1]);
    }
    return requires;
  };
  
  const traverse = (fileName) => {
    const normalizedName = normalizePath(fileName);
    
    if (visited.has(normalizedName)) return;
    if (!files[normalizedName]) {
      throw new Error(`Missing file: ${normalizedName}`);
    }
    
    visited.add(normalizedName);
    
    const transformed = transform(files[normalizedName], {
      presets: ['env']
    }).code;
    
    modules[normalizedName] = transformed;
    
    const deps = extractRequires(transformed);
    deps.forEach(dep => traverse(dep));
  };
  
  traverse(entryFile);
  
  const moduleEntries = Object.entries(modules).map(([name, code]) => 
    `${JSON.stringify(name)}: function(require, module, exports) {\n${code}\n}`
  ).join(',\n');
  
  return `(function() {
  const modules = {
${moduleEntries}
  };
  
  const cache = {};
  
  function require(name) {
    const normalized = name.replace(/^\.\//, '').replace(/\.js$/, '') + '.js';
    
    if (cache[normalized]) {
      return cache[normalized].exports;
    }
    
    if (!modules[normalized]) {
      throw new Error('Module not found: ' + normalized);
    }
    
    const module = { exports: {} };
    cache[normalized] = module;
    
    modules[normalized](require, module, module.exports);
    
    return module.exports;
  }
  
  return require(${JSON.stringify(normalizePath(entryFile))});
})();`;
}
export default bundleApp;