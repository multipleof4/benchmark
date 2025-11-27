async function findLISLength(arr) {
  const { bisectLeft } = await import('https://cdn.jsdelivr.net/npm/d3-array@3');
  let tails = [];
  for (let num of arr) {
    let pos = bisectLeft(tails, num);
    if (pos === tails.length) {
      tails.push(num);
    } else {
      tails[pos] = num;
    }
  }
  return tails.length;
}
export default findLISLength;
// Generation time: 47.415s
// Result: FAIL