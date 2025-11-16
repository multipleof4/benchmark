async function findLISLength(arr) {
  const {bisectLeft} = await import('https://cdn.skypack.dev/d3-array');
  let tails = [];
  for (let num of arr) {
    let i = bisectLeft(tails, num);
    if (i === tails.length) {
      tails.push(num);
    } else {
      tails[i] = num;
    }
  }
  return tails.length;
}
export default findLISLength;