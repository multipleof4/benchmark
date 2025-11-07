const findLISLength = async (nums) => {
  const { bisectLeft } = await import('https://cdn.jsdelivr.net/npm/d3-array@3/+esm');
  
  if (!nums?.length) return 0;
  
  const tails = [];
  
  for (const num of nums) {
    const idx = bisectLeft(tails, num);
    tails[idx] = num;
  }
  
  return tails.length;
};
export default findLISLength;