const parseMarkdown = async (md) => {
  try {
    const [
      { marked },
      { default: DOMPurify }
    ] = await Promise.all([
      import('https://cdn.jsdelivr.net/npm/marked@13.0.0/lib/marked.esm.js'),
      import('https://cdn.jsdelivr.net/npm/dompurify@3.1.5/dist/purify.es.mjs')
    ]);

    const rawHtml = marked.parse(md || '', {
      gfm: true,
      breaks: true,
    });

    return DOMPurify.sanitize(rawHtml);
  } catch (err) {
    console.error('Failed to parse markdown:', err);
    const el = document.createElement('div');
    el.textContent = md || '';
    return el.innerHTML;
  }
};
export default parseMarkdown;