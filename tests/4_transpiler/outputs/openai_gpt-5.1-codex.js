async function renderTemplate(t,d){
  const {default:h}=await import('https://cdn.jsdelivr.net/npm/handlebars@latest/+esm')
  return h.compile(t)(d)
}
export default renderTemplate;