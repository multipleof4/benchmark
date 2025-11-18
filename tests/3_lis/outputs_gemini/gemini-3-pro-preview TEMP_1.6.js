const findLISLength = async (nums) => {
  const { bisectLeft } = await import('https://esm.sh/d3-array@3');
  const tails = [];
  for (const n of nums) {
    tails[bisectLeft(tails, n)] = n;
  }
  return tails.length;
};
export default findLISLength;