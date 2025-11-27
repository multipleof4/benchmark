const renderTemplate = async (t, d) =>
  (await import('https://esm.sh/handlebars'))
    .default.compile(t)(d)
export default renderTemplate;
// Generation time: 29.656s
// Result: PASS