const parseMarkdown = async s =>
  (await import('https://cdn.jsdelivr.net/npm/marked/+esm'))
  .parse(s)
export default parseMarkdown;