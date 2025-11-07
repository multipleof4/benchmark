async function parseMarkdown(md) {
  if (typeof md !== "string") md = String(md ?? "");
  const [{ default: marked }] = await Promise.all([
    import("https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.esm.js")
  ]);
  marked.setOptions({
    gfm: true,
    breaks: false,
    headerIds: true,
    mangle: false
  });
  return marked.parse(md);
}
export default parseMarkdown;