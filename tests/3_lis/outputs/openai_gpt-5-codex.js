const findLISLength=async a=>{
 if(!Array.isArray(a)) throw new TypeError('Expected an array')
 const {bisectLeft:b}=await (findLISLength.m??=import('https://cdn.jsdelivr.net/npm/d3-array@3/+esm'))
 const t=[]
 for(const v of a){
  if(!Number.isFinite(v)) throw new TypeError('Array values must be finite numbers')
  const i=b(t,v)
  if(i===t.length) t.push(v)
  else t[i]=v
 }
 return t.length
}
window.findLISLength=findLISLength
export default findLISLength;