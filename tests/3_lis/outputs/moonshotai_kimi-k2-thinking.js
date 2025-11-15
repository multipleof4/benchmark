async function findLISLength(nums){
  const{bisectLeft}=await import('https://cdn.skypack.dev/d3-array');
  const tails=[];
  for(const n of nums)tails[bisectLeft(tails,n)]=n;
  return tails.length;
}
export default findLISLength;