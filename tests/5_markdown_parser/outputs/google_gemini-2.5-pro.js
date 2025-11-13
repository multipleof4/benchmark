const parseMarkdown = async (md) => {
  const cdn = 'https://cdn.jsdelivr.net/npm/marked@13.0.0/lib/marked.esm.js';
  const { marked } = await import(cdn);
  return marked.parse(md);
};
export default parseMarkdown;