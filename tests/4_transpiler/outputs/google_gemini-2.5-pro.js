const renderTemplate = async (templateString, data) => {
  const { default: Handlebars } = await import('https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.min.js');
  return Handlebars.compile(templateString)(data);
};
export default renderTemplate;