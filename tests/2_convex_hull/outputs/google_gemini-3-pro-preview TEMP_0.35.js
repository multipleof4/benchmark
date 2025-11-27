const findConvexHull = async (pts) => {
  const { default: _ } = await import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm')
  const s = _.sortBy(_.uniqWith(pts, _.isEqual), ['x', 'y'])
  if (s.length < 3) return s
  
  const cp = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)
  const walk = (h, p) => {
    while (h.length >= 2 && cp(h[h.length - 2], h[h.length - 1], p) <= 0) h.pop()
    h.push(p)
    return h
  }

  const l = s.reduce(walk, [])
  const u = s.reduceRight(walk, [])
  
  return [...l.slice(0, -1), ...u.slice(0, -1)]
}
export default findConvexHull;
// Generation time: 33.416s
// Result: PASS