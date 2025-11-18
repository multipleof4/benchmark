const findLISLength = async a => {
  const { bisectLeft: b } = await import('https://cdn.jsdelivr.net/npm/d3-array@3/+esm')
  const t = []
  for (const n of a) t[b(t, n)] = n
  return t.length
}
export default findLISLength;