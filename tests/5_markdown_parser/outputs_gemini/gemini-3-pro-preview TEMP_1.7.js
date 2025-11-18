const parseMarkdown = async md => {
  const { parse } = await import('https://cdn.jsdelivr.net/npm/marked/+esm')
  return parse(md)
}
export default parseMarkdown;