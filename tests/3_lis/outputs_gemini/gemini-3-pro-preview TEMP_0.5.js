const findLISLength = async (nums) => {
  const { bisectLeft } = await import('https://cdn.jsdelivr.net/npm/d3-array@3/+esm')
  const tails = []
  for (const x of nums) tails[bisectLeft(tails, x)] = x
  return tails.length
}
export default findLISLength;