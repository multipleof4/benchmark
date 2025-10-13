const loadBisectLeft=(()=>{let cache;return()=>cache||(cache=import('https://cdn.jsdelivr.net/npm/d3-array@3/+esm').then(({bisectLeft})=>bisectLeft));})();  
export async function findLISLength(nums){  
  if(!Array.isArray(nums)) throw new TypeError('Expected an array');  
  if(!nums.length) return 0;  
  const bisectLeft=await loadBisectLeft();  
  const tails=[];  
  for(const value of nums){  
    if(!Number.isFinite(value)) throw new TypeError('Array must contain only finite numbers');  
    const index=bisectLeft(tails,value,0,tails.length);  
    tails[index]=value;  
  }  
  return tails.length;  
}
export default findLISLength;