async function renderTemplate(template, data) {
  const { default: Handlebars } = await import('https://esm.sh/handlebars');
  const compiled = Handlebars.compile(template);
  return compiled(data);
}
export default renderTemplate;
// Generation time: 22.419s
// Result: PASS