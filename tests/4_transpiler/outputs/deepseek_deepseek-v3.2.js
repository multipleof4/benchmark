const renderTemplate = async (templateString, data) => {
  const { default: Handlebars } = await import('https://cdn.skypack.dev/handlebars');
  const template = Handlebars.compile(templateString);
  return template(data);
};
export default renderTemplate;
// Generation time: 3.202s
// Result: PASS