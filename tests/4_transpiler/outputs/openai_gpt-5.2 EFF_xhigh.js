const HANDLEBARS_CDN = "https://cdn.jsdelivr.net/npm/handlebars@4.7.8/+esm"

let hbP
const tplCache = new Map()

const loadHB = () => hbP ??= import(HANDLEBARS_CDN).then(m => m.default ?? m)

async function renderTemplate(template, data = {}) {
  if (typeof template != "string") throw new TypeError("Template must be a string")
  const HB = await loadHB()
  let fn = tplCache.get(template)
  fn || tplCache.set(template, fn = HB.compile(template))
  return fn(data ?? {})
}
export default renderTemplate;
// Generation time: 77.305s
// Result: PASS