export async function renderTemplate(template, data) {
  const load = async () => {
    try {
      const src = 'https://cdn.jsdelivr.net/npm/handlebars@4.7.7/dist/handlebars.min.js'
      const mod = await import(src)
      return mod.default || mod.Handlebars || mod
    } catch (e) {
      const alt = 'https://unpkg.com/handlebars@4.7.7/dist/handlebars.min.js'
      const mod2 = await import(alt)
      return mod2.default || mod2.Handlebars || mod2
    }
  }
  const hbs = await load()
  const s = String(template)
  const f = hbs.compile(s, { noEscape: false })
  return f(data)
}
export default renderTemplate;
// Generation time: 13.350s
// Result: FAIL