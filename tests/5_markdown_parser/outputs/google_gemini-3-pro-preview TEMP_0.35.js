const parseMarkdown = async (md) => {
  const { parse } = await import('https://esm.sh/marked@12.0.0')
  return parse(String(md || ''))
}
export default parseMarkdown;
// Generation time: 42.618s
// Result: PASS