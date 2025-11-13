async function findLISLength(a) {
  const {bisectLeft:b} = await import('https://cdn.jsdelivr.net/npm/d3-array@3/+esm')
  const t = []
  for (const x of a) {
    const i = b(t, x)
    t[i] = x
  }
  return t.length
}
export default findLISLength;