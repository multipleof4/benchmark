async function parseMarkdown(md) {
  const { marked } = await import('https://cdn.jsdelivr.net/npm/marked@11.1.1/+esm');
  return marked.parse(md);
}
export default parseMarkdown;