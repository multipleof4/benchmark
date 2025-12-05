export const renderTemplate=async(template,data)=>{
  const {default:Handlebars}=await import('https://cdn.jsdelivr.net/npm/handlebars@latest/+esm')
  return Handlebars.compile(template)(data)
}
export default renderTemplate;
// Generation time: 4.362s
// Result: PASS