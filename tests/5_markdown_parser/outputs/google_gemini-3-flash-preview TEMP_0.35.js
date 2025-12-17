const parseMarkdown = async (markdown = '') => {
  const { marked } = await import('https://cdn.jsdelivr.net/npm/marked@12.0.1/lib/marked.esm.js');

  return marked.parse(markdown, {
    gfm: true,
    breaks: true
  });
};
export default parseMarkdown;
// Generation time: 23.564s
// Result: PASS