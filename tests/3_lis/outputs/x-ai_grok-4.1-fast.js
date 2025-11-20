async function findLISLength(arr) {
  const {bisectLeft} = await import('https://cdn.jsdelivr.net/npm/d3-array@3/+esm');
  let tails = [];
  for (let num of arr) {
    let i = bisectLeft(tails, num);
    if (i === tails.length) tails.push(num);
    else tails[i] = num;
  }
  return tails.length;
}
export default findLISLength;