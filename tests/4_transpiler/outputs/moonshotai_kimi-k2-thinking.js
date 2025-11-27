let h, c = new Map();
const renderTemplate = async (t, d) => {
  h ||= (await import('https://cdn.jsdelivr.net/npm/handlebars@4.7.8/dist/handlebars.min.js')).default;
  c.has(t) || c.set(t, h.compile(t));
  return c.get(t)(d);
};
export default renderTemplate;