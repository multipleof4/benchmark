const parseMarkdown = async (markdown) => {
  const cdnUrl = 'https://cdn.jsdelivr.net/npm/marked@13.0.0/lib/marked.esm.js';
  const { marked } = await import(cdnUrl);
  return marked.parse(markdown ?? '');
};
export default parseMarkdown;