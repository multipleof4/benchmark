async function parseMarkdown(markdown) {
  const cdn = 'https://cdn.jsdelivr.net/npm/marked@12/lib/marked.esm.js';
  const { marked } = await import(cdn);
  return marked.parse(markdown);
}
export default parseMarkdown;