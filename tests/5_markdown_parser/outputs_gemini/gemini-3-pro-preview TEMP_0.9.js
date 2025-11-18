const parseMarkdown = async (content = '') => {
  const { marked } = await import('https://cdn.jsdelivr.net/npm/marked@12.0.2/+esm')
  return marked.parse(content)
}
export default parseMarkdown;