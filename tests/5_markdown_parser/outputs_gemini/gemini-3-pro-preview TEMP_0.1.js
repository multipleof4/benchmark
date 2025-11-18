const parseMarkdown = async t => {
  const { parse } = await import('https://esm.sh/marked')
  return parse(t ?? '')
}
export default parseMarkdown;