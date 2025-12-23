const renderTemplate = async (template, data) => {
  const { default: H } = await import('https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.module.js');
  return H.compile(template)(data);
};
export default renderTemplate;
// Generation time: 39.777s
// Result: FAIL