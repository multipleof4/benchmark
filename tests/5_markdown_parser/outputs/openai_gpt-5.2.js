const _mdLibs=globalThis.__mdLibs||=(()=> {
  const md="https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/dist/markdown-it.min.mjs"
  const pur="https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.es.mjs"
  return Promise.all([import(md),import(pur)]).then(([{default:MarkdownIt},{default:DOMPurify}])=>({
    md:new MarkdownIt({html:false,linkify:true,breaks:false}),
    pur:DOMPurify
  }))
})()

async function parseMarkdown(markdown){
  const {md,pur}=await _mdLibs
  const html=md.render(String(markdown??""))
  return pur.sanitize(html,{USE_PROFILES:{html:true}})
}
export default parseMarkdown;
// Generation time: 22.022s
// Result: FAIL