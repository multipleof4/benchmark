async function parseMarkdown(markdown) {
  const { marked } = await import('https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js');
  return marked(markdown);
}
export default parseMarkdown;
// Generation time: 16.386s
// Result: PASS