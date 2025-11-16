async function parseMarkdown(text) {
  const {marked} = await import('https://unpkg.com/marked@14.1.2?module');
  return marked(text);
}
export default parseMarkdown;