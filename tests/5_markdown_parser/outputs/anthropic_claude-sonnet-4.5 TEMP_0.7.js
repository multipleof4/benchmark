const parseMarkdown = async (md) => {
  const { marked } = await import('https://cdn.jsdelivr.net/npm/marked@11/+esm');
  return marked.parse(md);
};
export default parseMarkdown;