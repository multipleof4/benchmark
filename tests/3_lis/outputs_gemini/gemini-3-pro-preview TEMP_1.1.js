async function findLISLength(a) {
  const { bisectLeft: b } = await import('https://cdn.jsdelivr.net/npm/d3-array/+esm')
  const t = []
  for (const n of a) {
    const i = b(t, n)
    i < t.length ? t[i] = n : t.push(n)
  }
  return t.length
}
export default findLISLength;