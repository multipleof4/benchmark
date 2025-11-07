async function parseMarkdown(markdown) {
  const {marked} = await import('https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.esm.js')
  marked.setOptions({
    gfm:true,
    breaks:false,
    headerIds:true,
    mangle:false
  })
  return marked.parse(String(markdown ?? ''))
}
export default parseMarkdown;