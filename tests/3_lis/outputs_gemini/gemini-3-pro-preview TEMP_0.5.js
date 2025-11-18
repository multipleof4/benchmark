const findLISLength = async a => {
  const { bisectLeft: b } = await import('https://esm.sh/d3-array')
  const t = []
  for (const n of a) t[b(t, n)] = n
  return t.length
}
export default findLISLength;