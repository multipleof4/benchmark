const parseMarkdown = async m => {
  const { marked } = await import('https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js')
  return marked.parse(m)
}
export default parseMarkdown;