const bundleApp=async(entry,files)=>{
  const {transform}=(await import('https://esm.sh/@babel/standalone@7.23.9')).default
  const mods=new Map
  const norm=(from,to)=>{
    if(!to.startsWith('.'))return to
    const parts=from.split('/')
    parts.pop()
    to.split('/').forEach(part=>{
      if(!part||part=='.')return
      part=='..'?parts.pop():parts.push(part)
    })
    return parts.join('/')
  }
  const walk=file=>{
    if(mods.has(file))return
    const src=files[file]
    if(src==null)throw new Error(`Missing file: ${file}`)
    const {code}=transform(src,{presets:[['env',{modules:'commonjs'}]],sourceType:'module'})
    const deps={}
    for(const m of code.matchAll(/require\((['"])(.+?)\1\)/g)){
      const spec=m[2]
      deps[spec]=norm(file,spec)
    }
    mods.set(file,{code,deps})
    Object.values(deps).forEach(walk)
  }
  walk(entry)
  const esc=s=>s.replace(/\\/g,'\\\\').replace(/`/g,'\\`').replace(/\$\{/g,'\\${')
  const body=[...mods].map(([id,{code,deps}])=>`"${id}":[function(require,module,exports){${esc(code)}},${JSON.stringify(deps)}]`).join(',')
  return `(()=>{var m={${body}},c={},p=(f,s)=>{if(!s.startsWith('.'))return s;var a=f.split('/');a.pop();s.split('/').forEach(b=>{if(!b||b=='.')return;b=='..'?a.pop():a.push(b)});return a.join('/')},r=f=>{if(!m[f])throw new Error("Missing module "+f);if(c[f])return c[f].exports;var d=m[f],mod={exports:{}};c[f]=mod;d[0](g=>{var t=d[1][g];return r(t?t:p(f,g))},mod,mod.exports);return mod.exports};return r("${entry}")})()`
}
export default bundleApp;