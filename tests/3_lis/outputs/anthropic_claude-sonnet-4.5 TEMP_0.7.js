async function findLISLength(arr) {
  const { bisectLeft } = await import('https://cdn.jsdelivr.net/npm/d3-array@3/+esm');
  
  if (!arr?.length) return 0;
  
  const tails = [];
  
  for (const num of arr) {
    const idx = bisectLeft(tails, num);
    tails[idx] = num;
  }
  
  return tails.length;
}
export default findLISLength;