async function findLISLength(arr) {
  const { bisectLeft } = await import('https://cdn.skypack.dev/d3-array');
  
  if (!arr?.length) return 0;
  
  const tails = [];
  
  for (const num of arr) {
    const pos = bisectLeft(tails, num);
    tails[pos] = num;
  }
  
  return tails.length;
}
export default findLISLength;