let p, md, purify;

const load = () =>
  p ??= Promise.all([
    import("https://cdn.jsdelivr.net/npm/markdown-it@14/dist/markdown-it.esm.js"),
    import("https://cdn.jsdelivr.net/npm/dompurify@3/dist/purify.es.mjs")
  ]).then(([{ default: MarkdownIt }, { default: DOMPurify }]) => {
    md ||= new MarkdownIt({ html: true, linkify: true });
    purify ||= DOMPurify;
  }).catch(e => {
    p = 0;
    throw e;
  });

async function parseMarkdown(src) {
  await load();
  return purify.sanitize(md.render(`${src ?? ""}`), { USE_PROFILES: { html: true } });
}
export default parseMarkdown;
// Generation time: 136.807s
// Result: FAIL