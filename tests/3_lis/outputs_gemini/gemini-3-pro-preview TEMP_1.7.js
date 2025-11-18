const findLISLength = async nums => {
  const { bisectLeft: search } = await import('https://esm.sh/d3-array')
  const tails = []
  for (const n of nums) tails[search(tails, n)] = n
  return tails.length
}
export default findLISLength;