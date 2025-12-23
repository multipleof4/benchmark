async function renderTemplate(template, data) {
  window.Handlebars || await import('https://cdn.jsdelivr.net/npm/handlebars@4.7.7/dist/handlebars.min.js');
  return window.Handlebars.compile(template)(data);
}
export default renderTemplate;
// Generation time: 42.558s
// Result: FAIL