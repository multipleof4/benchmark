const renderTemplate = async (template, data) => {
  const { default: Handlebars } = await import('https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.min.js')
  const compiled = Handlebars.compile(template)
  return compiled(data)
}
export default renderTemplate;