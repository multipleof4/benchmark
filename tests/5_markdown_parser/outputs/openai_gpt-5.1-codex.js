const parseMarkdown=(()=>{
  let m,r
  return async t=>{
    if(!r){
      ({marked:m}=await import('https://cdn.jsdelivr.net/npm/marked@11.1.1/+esm'))
      m.setOptions({gfm:1,mangle:0,headerIds:0})
      r=1
    }
    return m.parse(t)
  }
})()
export default parseMarkdown;