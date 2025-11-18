const parseMarkdown = async md => {
  const { parse } = await import('https://cdn.jsdelivr.net/npm/marked@12/+esm')
  return parse(md)
}
export default parseMarkdown;