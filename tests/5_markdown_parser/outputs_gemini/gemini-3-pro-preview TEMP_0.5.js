const parseMarkdown = async s => {
  if (typeof s !== 'string') return ''
  try {
    const { parse } = await import('https://cdn.jsdelivr.net/npm/marked/+esm')
    return parse(s)
  } catch (e) {
    console.error(e)
    return ''
  }
}
export default parseMarkdown;