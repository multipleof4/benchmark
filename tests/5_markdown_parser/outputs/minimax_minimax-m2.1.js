async function parseMarkdown(markdown) {
  try {
    const { marked } = await import('https://cdn.jsdelivr.net/npm/marked@5.1.0/lib/marked.esm.min.js');
    return marked.parse(markdown);
  } catch (error) {
    return `<p>Error parsing markdown: ${error.message}</p>`;
  }
}
export default parseMarkdown;
// Generation time: 10.685s
// Result: PASS