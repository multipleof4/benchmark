async function parseMarkdown(md) {
  const { marked } = await import('https://cdn.skypack.dev/marked');
  return marked.parse(md);
}
export default parseMarkdown;