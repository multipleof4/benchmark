async function findLISLength(a){
 const{bisectLeft}=await import('https://cdn.jsdelivr.net/npm/d3-array@3/+esm')
 const t=[]
 for(const x of a){
  const i=bisectLeft(t,x)
  t[i]=x
 }
 return t.length
}
export default findLISLength;
// Generation time: 6.704s
// Result: PASS