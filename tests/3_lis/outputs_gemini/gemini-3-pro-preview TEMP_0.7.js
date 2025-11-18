const findLISLength = async n => {
  const { bisectLeft: b } = await import('https://cdn.jsdelivr.net/npm/d3-array@3/+esm')
  const t = []
  for (const x of n) {
    t[b(t, x)] = x
  }
  return t.length
}
export default findLISLength;