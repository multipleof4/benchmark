const findConvexHull = async points => {
  const { default: _ } = await import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm')
  const p = _.sortBy(_.uniqWith(points, _.isEqual), ['x', 'y'])
  if (p.length < 3) return p
  const h = [], x = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)
  for (let i = 0; i < p.length; i++) {
    while (h.length >= 2 && x(h[h.length - 2], h[h.length - 1], p[i]) <= 0) h.pop()
    h.push(p[i])
  }
  for (let i = p.length - 2, t = h.length + 1; i >= 0; i--) {
    while (h.length >= t && x(h[h.length - 2], h[h.length - 1], p[i]) <= 0) h.pop()
    h.push(p[i])
  }
  h.pop()
  return h
}
export default findConvexHull;