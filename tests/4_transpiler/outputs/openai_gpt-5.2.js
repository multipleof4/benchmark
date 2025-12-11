export async function renderTemplate(t, d = {}) {
  let { default: H } = await import("https://esm.sh/handlebars@4.7.8")
  return H.compile(String(t))({ ...d })
}
export default renderTemplate;
// Generation time: 2.200s
// Result: PASS