async function findLISLength(arr) {
  const d3 = await import('https://esm.sh/d3-array@3.2.4');
  const tails = [];
  for (const num of arr) {
    const i = d3.bisectLeft(tails, num);
    tails[i] = num;
  }
  return tails.length;
}
export default findLISLength;
// Generation time: 3.865s
// Result: PASS