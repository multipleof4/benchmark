async function bundleApp(entryFile, files) {
  const Babel = await import('https://esm.sh/@babel/standalone');
  const modules = {};
  const visited = new Set();

  const resolve = (from, to) => {
    if (!to.startsWith('./') && !to.startsWith('../')) return to;
    const fromParts = from.split('/').slice(0, -1);
    const toParts = to.split('/');
    for (const p of toParts) {
      if (p === '..') fromParts.pop();
      else if (p !== '.') fromParts.push(p);
    }
    return fromParts.join('/') || toParts[toParts.length - 1];
  };

  const extractDeps = code => {
    const deps = [];
    const re = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    let m;
    while ((m = re.exec(code))) deps.push(m[1]);
    return deps;
  };

  const process = file => {
    if (visited.has(file)) return;
    visited.add(file);
    if (!(file in files)) throw new Error(`Missing file: ${file}`);
    const transformed = Babel.transform(files[file], {
      presets: ['env'],
      filename: file
    }).code;
    const deps = extractDeps(transformed);
    const resolved = {};
    for (const d of deps) {
      const r = resolve(file, d);
      resolved[d] = r;
      process(r);
    }
    modules[file] = { code: transformed, deps: resolved };
  };

  process(entryFile);

  const modulesObj = JSON.stringify(
    Object.fromEntries(
      Object.entries(modules).map(([k, v]) => [
        k,
        { code: v.code, deps: v.deps }
      ])
    )
  );

  return `(function(){
var __modules__=${modulesObj};
var __cache__={};
var __resolve__=function(f,t){
var d=__modules__[f].deps;
return d[t]||t;
};
var __require__=function(from,id){
var resolved=__resolve__(from,id);
if(__cache__[resolved])return __cache__[resolved].exports;
var mod=__modules__[resolved];
if(!mod)throw new Error("Cannot find module: "+resolved);
var module={exports:{}};
__cache__[resolved]=module;
var fn=new Function("require","module","exports",mod.code);
fn(function(id){return __require__(resolved,id);},module,module.exports);
return module.exports;
};
return __require__("","${entryFile}");
})()`;
}
export default bundleApp;