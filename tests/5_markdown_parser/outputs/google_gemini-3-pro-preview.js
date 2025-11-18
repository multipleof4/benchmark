const parseMarkdown = async md => {
  const { parse } = await import('https://cdn.jsdelivr.net/npm/marked@12.0.1/lib/marked.esm.js')
  return parse(md)
}
export default parseMarkdown;