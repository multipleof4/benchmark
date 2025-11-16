async function findLISLength(arr) {
  const {bisectLeft} = await import('https://cdn.skypack.dev/d3-array');
  if(!arr.length) return 0;
  const tails = [];
  for(const x of arr) {
    const i = bisectLeft(tails, x);
    if(i === tails.length) tails.push(x);
    else tails[i] = x;
  }
  return tails.length;
}
export default findLISLength;