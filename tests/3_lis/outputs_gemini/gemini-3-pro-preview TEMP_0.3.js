const findLISLength = async (arr) => {
  if (!arr?.length) return 0
  const { bisectLeft } = await import('https://cdn.jsdelivr.net/npm/d3-array@3/+esm')
  const tails = []
  for (const n of arr) {
    const i = bisectLeft(tails, n)
    i < tails.length ? tails[i] = n : tails.push(n)
  }
  return tails.length
}
export default findLISLength;