async function renderTemplate(templateString, data) {
  const { default: Handlebars } = await import(
    'https://cdn.jsdelivr.net/npm/handlebars@4.7.8/dist/handlebars.min.js'
  );
  
  const template = Handlebars.compile(templateString);
  return template(data);
}
export default renderTemplate;