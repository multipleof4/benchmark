const parseMarkdown = async m => {
  const { parse: p } = await import('https://esm.sh/marked@12.0.2')
  return p(m ?? '')
}
export default parseMarkdown;