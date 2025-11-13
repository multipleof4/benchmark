async function findLISLength(nums){
  const {bisectLeft}=await import('https://cdn.jsdelivr.net/npm/d3-array@3/+esm')
  const tails=[]
  for(const n of nums){
    const i=bisectLeft(tails,n)
    tails[i]=n
  }
  return tails.length
}
export default findLISLength;