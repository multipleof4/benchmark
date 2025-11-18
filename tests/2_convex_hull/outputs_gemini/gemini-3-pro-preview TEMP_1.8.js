const findConvexHull = async (pts) => {
  const { default: _ } = await import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/+esm')
  const s = _.sortBy(_.uniqWith(pts, _.isEqual), ['x', 'y'])
  if (s.length < 3) return s

  const k = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)
  const f = (h, p) => {
    while (h.length >= 2 && k(h[h.length - 2], h[h.length - 1], p) <= 0) h.pop()
    h.push(p)
    return h
  }

  const l = _.reduce(s, f, [])
  const u = _.reduceRight(s, f, [])
  
  return [..._.dropRight(l), ..._.dropRight(u)]
}
export default findConvexHull;