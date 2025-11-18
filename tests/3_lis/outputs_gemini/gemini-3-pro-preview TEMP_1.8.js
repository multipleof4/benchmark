const findLISLength = async (n) => {
  const { bisectLeft: b } = await import('https://esm.run/d3-array')
  const t = []
  for (const v of n) t[b(t, v)] = v
  return t.length
}
export default findLISLength;