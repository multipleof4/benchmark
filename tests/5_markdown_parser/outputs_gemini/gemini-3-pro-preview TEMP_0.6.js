let parser

const parseMarkdown = async (md) => {
  parser ??= (await import('https://cdn.jsdelivr.net/npm/marked/+esm')).parse
  return parser(md)
}
export default parseMarkdown;