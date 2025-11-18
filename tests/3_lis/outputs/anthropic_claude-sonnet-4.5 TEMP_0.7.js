const findLISLength = async (arr) => {
  const { bisectLeft } = await import('https://cdn.skypack.dev/d3-array');
  
  if (!arr?.length) return 0;
  
  const tails = [];
  
  for (const num of arr) {
    const idx = bisectLeft(tails, num);
    tails[idx] = num;
  }
  
  return tails.length;
};
export default findLISLength;