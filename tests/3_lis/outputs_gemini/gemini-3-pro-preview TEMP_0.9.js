const findLISLength = async a => {
  const { bisectLeft: b } = await import('https://esm.sh/d3-array')
  const q = []
  for (const n of a) q[b(q, n)] = n
  return q.length
}
export default findLISLength;