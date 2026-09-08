let lib;

export async function parseMarkdown(text = '') {
  lib ??= import('https://esm.sh/marked');
  const { marked } = await lib;
  return marked.parse(String(text));
}
export default parseMarkdown;
// Generation time: 15.759s
// Result: PASS