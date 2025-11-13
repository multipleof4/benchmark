const findLISLength = async (arr) => {
  if (!arr?.length) return 0;
  
  const { bisectLeft } = await import('https://cdn.jsdelivr.net/npm/d3-array@3/+esm');
  
  const tails = [];
  
  for (const num of arr) {
    const pos = bisectLeft(tails, num);
    tails[pos] = num;
  }
  
  return tails.length;
};
export default findLISLength;