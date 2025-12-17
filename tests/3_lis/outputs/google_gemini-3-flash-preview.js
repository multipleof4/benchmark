const findLISLength = async (nums) => {
  const { bisectLeft } = await import('https://cdn.skypack.dev/d3-array@3');
  const tails = [];

  for (const x of nums) {
    const i = bisectLeft(tails, x);
    tails[i] = x;
  }

  return tails.length;
};


export default findLISLength;
// Generation time: 13.472s
// Result: PASS