const bundleApp = async (entry, files) => {
  const { transform } = await import('https://esm.sh/@babel/standalone');
  let id = 0, queue = [{ name: entry, id: id++ }], modules = [];

  for (const asset of queue) {
    if (files[asset.name] == null) throw new Error(`Missing file: ${asset.name}`);
    
    const { code } = transform(files[asset.name], { presets: ['env'] });
    const map = {};

    code.replace(/require\s*\(\s*['"](.+?)['"]\s*\)/g, (_, path) => {
      const base = asset.name.split('/'), rel = path.split('/');
      base.pop();
      rel.forEach(p => p === '..' ? base.pop() : p !== '.' && base.push(p));
      const abs = base.join('/');
      
      let child = queue.find(x => x.name === abs);
      if (!child) queue.push(child = { name: abs, id: id++ });
      map[path] = child.id;
    });

    modules.push(`${asset.id}:[function(require,module,exports){${code}},${JSON.stringify(map)}]`);
  }

  return `;(function(m){
    var c={};
    function r(i){
      if(c[i])return c[i].exports;
      var mod=c[i]={exports:{}}, fn=m[i][0], map=m[i][1];
      fn(p=>r(map[p]||p), mod, mod.exports);
      return mod.exports;
    }
    return r(0);
  })({${modules.join(',')}})`;
};
export default bundleApp;