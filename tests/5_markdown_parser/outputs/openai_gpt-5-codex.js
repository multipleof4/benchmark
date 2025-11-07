let md,pd
const getMd=()=>md||(md=import('https://cdn.jsdelivr.net/npm/marked@12.0.2/+esm').then(x=>{
  let m=x.marked||x.default
  m.setOptions?.({gfm:true,breaks:true,smartypants:true})
  return s=>m.parse?m.parse(s):m(s)
}))
const getPurify=()=>pd||(pd=import('https://esm.sh/dompurify@3?target=es2020').then(x=>{
  let d=x.default||x.DOMPurify||x
  return typeof d.sanitize=='function'?d:d(window)
}))
async function parseMarkdown(s){
  let [render,pur]=await Promise.all([getMd(),getPurify()])
  return pur.sanitize(render(s))
}
export default parseMarkdown;