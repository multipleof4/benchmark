const parseMarkdown = async (markdown) => {
  const { default: marked } = await import('https://cdn.jsdelivr.net/npm/marked@4.0.12/lib/marked.esm.js')
  const { default: DOMPurify } = await import('https://cdn.jsdelivr.net/npm/dompurify@3.0.5/dist/purify.es.mjs')

  marked.setOptions({
    gfm: true,
    breaks: true,
    headerIds: false,
    mangle: false
  })

  const html = marked.parse(markdown)
  return DOMPurify.sanitize(html)
}
export default parseMarkdown;