async function renderTemplate(template, data) {
  const { default: Handlebars } = await import('https://esm.sh/handlebars');
  return Handlebars.compile(template)(data);
}
export default renderTemplate;