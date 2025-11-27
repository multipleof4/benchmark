async function findLISLength(nums) {
  if (!nums?.length) return 0;
  const { bisectLeft } = await import('https://cdn.jsdelivr.net/npm/d3-array@3/+esm');
  const tails = [];
  for (const n of nums) {
    const i = bisectLeft(tails, n);
    i < tails.length ? tails[i] = n : tails.push(n);
  }
  return tails.length;
}
export default findLISLength;
// Generation time: 3.101s
// Result: PASS