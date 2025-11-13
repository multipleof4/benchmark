const parseMarkdown = async (md) => {
  const { marked } = await import('https://cdn.jsdelivr.net/npm/marked@12.0.2/+esm');
  return marked.parse(md);
};
export default parseMarkdown;