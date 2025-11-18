const parseMarkdown = async md => {
  const { marked } = await import('https://esm.sh/marked@12')
  return marked.parse(md)
}
export default parseMarkdown;