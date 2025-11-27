async function bundleApp(entryFile, files) {
  const Babel = (await import("https://unpkg.com/@babel/standalone/babel.min.js")).default;
  
  const graph = new Map;
  const processing = new Set;
  
  function resolve(from, to) {
    if (!to.startsWith(".")) return to;
    const parts = from.split("/");
    parts.pop();
    for (const p of to.split("/")) p === ".." ? parts.pop() : p && p !== "." && parts.push(p);
    return parts.join("/");
  }
  
  function extract(code) {
    const deps = [];
    code.replace(/require\s*\(\s*["'`]([^"'`]+)["'`]\s*\)/g, (_, d) => deps.push(d));
    return deps;
  }
  
  function walk(file) {
    if (graph.has(file)) return;
    if (processing.has(file)) throw new Error(`Circular: ${file}`);
    if (!(file in files)) throw new Error(`Missing: ${file}`);
    processing.add(file);
    const code = Babel.transform(files[file], { presets: [["env", { modules: "cjs" }]] }).code;
    const deps = extract(code).map(d => resolve(file, d));
    graph.set(file, { code, deps });
    deps.forEach(walk);
    processing.delete(file);
  }
  
  walk(entryFile);
  
  return `(function(){const modules={},cache={};function require(path){if(cache[path])return cache[path].exports;const module={exports:{}};cache[path]=module;const fn=modules[path];if(!fn) {
    throw new Error('Missing: ' + path);
  }fn(require,module,module.exports);return module.exports;}
${Array.from(graph, ([p, {code}]) => `modules['${p}']=(function(require,module,exports){\n${code}\n});`).join("\n")}
return require('${entryFile}');})()`;
}
export default bundleApp;