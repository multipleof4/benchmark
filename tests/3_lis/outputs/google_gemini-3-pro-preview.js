const findLISLength = async arr => {
  const { bisectLeft } = await import('https://esm.sh/d3-array')
  const tails = []
  for (const n of arr) tails[bisectLeft(tails, n)] = n
  return tails.length
}
export default findLISLength;