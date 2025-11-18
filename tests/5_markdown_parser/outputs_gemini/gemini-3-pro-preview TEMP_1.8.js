const parseMarkdown = async md => (
  await import('https://esm.sh/marked@12')
).parse(md, { gfm: true, breaks: true })
export default parseMarkdown;