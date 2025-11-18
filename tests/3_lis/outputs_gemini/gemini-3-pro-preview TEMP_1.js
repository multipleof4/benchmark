const findLISLength = async nums => {
  const { bisectLeft } = await import('https://esm.sh/d3-array')
  const sub = []
  for (const n of nums) {
    sub[bisectLeft(sub, n)] = n
  }
  return sub.length
}
export default findLISLength;