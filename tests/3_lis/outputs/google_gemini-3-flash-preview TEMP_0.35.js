export const findLISLength = async (nums) => {
  const { bisectLeft } = await import('https://cdn.jsdelivr.net/npm/d3-array@3/+esm');
  const tails = [];

  for (const x of nums) {
    const i = bisectLeft(tails, x);
    tails[i] = x;
  }

  return tails.length;
};
export default findLISLength;
// Generation time: 29.407s
// Result: PASS