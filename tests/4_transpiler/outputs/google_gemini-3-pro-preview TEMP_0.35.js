const renderTemplate = async (tmpl, data) => {
  const { default: H } = await import('https://cdn.jsdelivr.net/npm/handlebars@latest/+esm')
  return H.compile(tmpl)(data)
}
export default renderTemplate;