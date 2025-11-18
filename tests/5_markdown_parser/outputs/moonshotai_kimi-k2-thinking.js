async function parseMarkdown(md) {
  const u = 'https://cdn.jsdelivr.net/npm/marked@9/lib/marked.esm.js';
  const o = {gfm:true,breaks:true,headerIds:false,mangle:false};
  
  try {
    const {marked} = await import(u);
    marked.setOptions(o);
    return marked.parse(md);
  } catch(e) {
    return `<p>${e.message}</p>`;
  }
}
export default parseMarkdown;