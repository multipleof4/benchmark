const m = import('https://cdn.jsdelivr.net/npm/d3-array@3/+esm');

async function findLISLength(nums) {
  const { bisectLeft: b } = await m;
  const tails = [];
  for (const n of nums) tails[b(tails, n)] = n;
  return tails.length;
}
export default findLISLength;