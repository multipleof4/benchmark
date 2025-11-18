const parseMarkdown = async (md) => {
  const { parse } = await import('https://esm.run/marked')
  return parse(md ?? '', { async: false })
}
export default parseMarkdown;