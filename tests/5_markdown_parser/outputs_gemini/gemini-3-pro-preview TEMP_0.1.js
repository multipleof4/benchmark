const parseMarkdown = async s => {
  const [{ marked: m }, { default: p }] = await Promise.all([
    import('https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js'),
    import('https://cdn.jsdelivr.net/npm/dompurify/dist/purify.es.js')
  ])
  return p.sanitize(m.parse(s))
}
export default parseMarkdown;