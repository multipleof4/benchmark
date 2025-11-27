async function renderTemplate(tpl, data) {
  const { default: h } = await import('https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.esm.js')
  return h.compile(tpl)(data)
}
export default renderTemplate;
// Generation time: 2.868s
// Result: FAIL