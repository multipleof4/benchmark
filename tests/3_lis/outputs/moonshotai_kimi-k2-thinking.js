export async function findLISLength(nums) {
  if (!Array.isArray(nums) || nums.length === 0) return 0;
  
  const { bisectLeft } = await import('https://cdn.jsdelivr.net/npm/d3-array@3/+esm');
  const tails = [];
  
  for (const num of nums) {
    const idx = bisectLeft(tails, num);
    idx === tails.length ? tails.push(num) : tails[idx] = num;
  }
  
  return tails.length;
}
export default findLISLength;