const renderTemplate = async (template, data) => {
  const { default: hb } = await import('https://esm.sh/handlebars');
  return hb.compile(template)(data);
};
export default renderTemplate;
// Generation time: 14.517s
// Result: PASS