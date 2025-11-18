async function parseMarkdown(md) {
  if (!md?.trim()) return '';
  try {
    const [{ marked }, { default: DOMPurify }] = await Promise.all([
      import('https://esm.sh/marked@9'),
      import('https://esm.sh/dompurify@3')
    ]);
    marked.setOptions({ gfm: true, breaks: true });
    return DOMPurify.sanitize(marked.parse(md));
  } catch (e) {
    console.error('Markdown parse error:', e);
    return '';
  }
}
export default parseMarkdown;