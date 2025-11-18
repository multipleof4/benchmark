const findLISLength = async nums => {
  if (!Array.isArray(nums)) throw new TypeError('Expected array')
  const { bisectLeft } = await import('https://cdn.jsdelivr.net/npm/d3-array@3/+esm')
  const tails = []
  for (const v of nums) {
    const i = bisectLeft(tails, v)
    i === tails.length ? tails.push(v) : tails[i] = v
  }
  return tails.length
}
export default findLISLength;