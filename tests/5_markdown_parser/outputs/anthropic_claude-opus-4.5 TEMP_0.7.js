async function parseMarkdown(t) {
  const { marked } = await import("https://esm.sh/marked@12.0.0");
  return marked.parse(t);
}
export default parseMarkdown;