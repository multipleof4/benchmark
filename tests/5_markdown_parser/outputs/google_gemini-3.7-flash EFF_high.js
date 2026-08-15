export async function parseMarkdown(markdown) {
  const { marked } = await import('https://esm.sh/marked');
  return marked.parse(markdown ?? '');
}
export default parseMarkdown;
// Generation time: 6.155s
// Result: PASS