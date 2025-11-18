async function findLISLength(nums) {
  if (!nums?.length) {
    return 0;
  }

  const { bisectLeft } = await import('https://cdn.jsdelivr.net/npm/d3-array@3/+esm');
  
  const sub = [];

  for (const num of nums) {
    sub[bisectLeft(sub, num)] = num;
  }

  return sub.length;
}
export default findLISLength;