async function findLISLength(a){
  if(!a||!a.length)return 0
  const{bisectLeft}=await import('https://cdn.jsdelivr.net/npm/d3-array@3/+esm')
  const t=[]
  for(const x of a){
    const i=bisectLeft(t,x)
    if(i===t.length)t.push(x)
    else t[i]=x
  }
  return t.length
}
export default findLISLength;