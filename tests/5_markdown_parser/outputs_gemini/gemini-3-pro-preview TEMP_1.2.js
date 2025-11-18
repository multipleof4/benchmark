const parseMarkdown = async (md) => {
  const { marked: p } = await import('https://cdn.jsdelivr.net/npm/marked/+esm')
  return p.parse(md || '')
}
export default parseMarkdown;