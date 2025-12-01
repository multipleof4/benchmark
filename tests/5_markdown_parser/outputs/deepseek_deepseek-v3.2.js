async function parseMarkdown(markdown) {
  const { marked } = await import('https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js');
  const { gfmHeadingId } = await import('https://cdn.jsdelivr.net/npm/marked-gfm-heading-id/+esm');
  marked.use(gfmHeadingId());
  return marked.parse(markdown, { async: false, gfm: true, breaks: true });
}
export default parseMarkdown;
// Generation time: 4.398s
// Result: PASS