const parseMarkdown = async (markdownText) => {
  const cdnUrl = 'https://cdn.jsdelivr.net/npm/marked@13.0.2/lib/marked.esm.js';

  try {
    const { marked } = await import(cdnUrl);
    return marked.parse(markdownText || '');
  } catch (err) {
    console.error(`Failed to parse markdown: ${err}`);
    return markdownText || '';
  }
};
export default parseMarkdown;