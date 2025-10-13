const findLISLength = async (arr) => {
  if (!arr?.length) return 0;
  
  const { bisectLeft } = await import('https://cdn.skypack.dev/d3-array');
  
  const tails = [];
  
  for (const num of arr) {
    const pos = bisectLeft(tails, num);
    tails[pos] = num;
  }
  
  return tails.length;
};

export default findLISLength;
