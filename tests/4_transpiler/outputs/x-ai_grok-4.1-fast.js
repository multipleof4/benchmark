async function bundleApp(entryFile, files) {
  const babel = await import('https://esm.sh/@babel/standalone@7.24.7');
  const { transform } = babel;
  const modules = new Map();
  const visited = new Set();
  const reqRe = /require\s*\(\s*["']([^"']+)["']\s*\)/g;

  function dirname(file) {
    const i = file.lastIndexOf('/');
    return i === -1 ? '' : file.slice(0, i);
  }

  function resolvePath(from, imp) {
    const dirSegments = dirname(from).split('/');
    const impSegments = imp.split('/').filter(s => s !== '' && s !== '.');
    const resSegments = [...dirSegments];
    for (const seg of impSegments) {
      if (seg === '..') {
        resSegments.pop();
      } else {
        resSegments.push(seg);
      }
    }
    return resSegments.join('/');
  }

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function escapeStr(str) {
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  }

  async function process(file) {
    if (visited.has(file)) return;
    visited.add(file);
    const code = files[file];
    if (code === undefined) throw new Error(`Missing file: ${file}`);
    const res = transform(code, {
      presets: [['env', { modules: 'commonjs' }]],
      filename: file
    });
    if (res.error) throw new Error(`Babel error in ${file}: ${res.error}`);
    let tcode = res.code;
    const deps = new Set();
    let match;
    while ((match = reqRe.exec(tcode)) !== null) {
      deps.add(match[1]);
    }
    const rdeps = new Set([...deps].map(d => resolvePath(file, d)));
    for (const orig of deps) {
      const resolved = resolvePath(file, orig);
      const re = new RegExp(`require\\s*\\(\\s*["']${escapeRegExp(orig)}["']\\s*\\)`, 'g');
      tcode = tcode.replace(re, `require("${resolved}")`);
    }
    modules.set(file, tcode);
    await Promise.all(Array.from(rdeps).map(process));
  }

  const entryId = resolvePath('index.js', entryFile);
  await process(entryId);

  const sortedModules = Array.from(modules.entries()).sort(([a], [b]) => a.localeCompare(b));
  const bundleParts = [
    '(function(){',
    'var modules={'
  ];
  for (const [id, code] of sortedModules) {
    bundleParts.push(
      `'${escapeStr(id)}':function(r,m,e){`,
      code,
      '},'
    );
  }
  bundleParts.pop();
  bundleParts.push(
    '};',
    'var cache={};',
    'function req(id){',
    'if(cache[id])return cache[id].exports;',
    'var m={exports:{}};',
    'cache[id]=m;',
    'modules[id].call(m.exports,req,m,m.exports);',
    'return m.exports;',
    '}',
    `return req('${escapeStr(entryId)}');`,
    '})()'
  );
  return bundleParts.join('');
}
export default bundleApp;