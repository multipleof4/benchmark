let md
const parseMarkdown = async s => {
  md ||= (await import('https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js')).marked
  return md.parse(s)
}
export default parseMarkdown;
// Generation time: 8.679s
// Result: PASS