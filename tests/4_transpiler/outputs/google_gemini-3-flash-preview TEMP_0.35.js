const renderTemplate = async (template, data) => {
  const { default: h } = await import('https://esm.sh/handlebars@4.7.8');
  return h.compile(template)(data);
};
export default renderTemplate;
// Generation time: 18.775s
// Result: PASS