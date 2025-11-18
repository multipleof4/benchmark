const findLISLength = async (nums) => {
  if (!nums?.length) return 0
  const { bisectLeft } = await import('https://cdn.jsdelivr.net/npm/d3-array@3/+esm')
  const tails = []
  for (const x of nums) {
    const i = bisectLeft(tails, x)
    i < tails.length ? tails[i] = x : tails.push(x)
  }
  return tails.length
}
export default findLISLength;