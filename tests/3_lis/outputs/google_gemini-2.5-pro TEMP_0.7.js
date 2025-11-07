const findLISLength = async (nums) => {
  if (!nums?.length) return 0;

  const { bisectLeft } = await import('https://cdn.jsdelivr.net/npm/d3-array@3/+esm');

  const tails = [];

  for (const num of nums) {
    const i = bisectLeft(tails, num);
    tails[i] = num;
  }

  return tails.length;
};
export default findLISLength;