const findLISLength = async nums => {
  const { bisectLeft: search } = await import('https://cdn.jsdelivr.net/npm/d3-array@3/+esm')
  const tails = []
  for (const n of nums) tails[search(tails, n)] = n
  return tails.length
}
export default findLISLength;