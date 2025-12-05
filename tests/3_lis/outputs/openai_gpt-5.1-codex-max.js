async function findLISLength(a){
  let {bisectLeft}=await import('https://cdn.jsdelivr.net/npm/d3-array@3')
  let t=[]
  for(let x of a){
    let i=bisectLeft(t,x)
    t[i]=x
  }
  return t.length
}
export default findLISLength;
// Generation time: 8.286s
// Result: FAIL