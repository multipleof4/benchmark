const findLISLength = async (n) => {
  const { bisectLeft: b } = await import('https://cdn.jsdelivr.net/npm/d3-array@3/+esm')
  const t = []
  for (const v of n) {
    const i = b(t, v)
    i < t.length ? t[i] = v : t.push(v)
  }
  return t.length
}
export default findLISLength;