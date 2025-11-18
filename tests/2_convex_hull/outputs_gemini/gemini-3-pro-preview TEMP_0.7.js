const findConvexHull = async points => {
  const { default: _ } = await import('https://esm.sh/lodash')
  const s = _.sortBy(_.uniqWith(points, _.isEqual), ['x', 'y'])
  if (s.length < 3) return s
  
  const h = [], x = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)
  
  s.forEach(p => {
    while (h.length >= 2 && x(h.at(-2), h.at(-1), p) <= 0) h.pop()
    h.push(p)
  })
  
  const t = h.length + 1
  for (let i = s.length - 2; i >= 0; i--) {
    while (h.length >= t && x(h.at(-2), h.at(-1), s[i]) <= 0) h.pop()
    h.push(s[i])
  }
  
  h.pop()
  return h
}
export default findConvexHull;