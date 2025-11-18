const findLISLength = async a => {
  const { bisectLeft: b } = await import('https://esm.sh/d3-array')
  const t = []
  for (const v of a) {
    const i = b(t, v)
    i < t.length ? t[i] = v : t.push(v)
  }
  return t.length
}
export default findLISLength;