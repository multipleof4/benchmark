const parseMarkdown = async s => {
  const { parse } = await import('https://esm.sh/marked@12.0.1')
  return parse(s)
}
export default parseMarkdown;