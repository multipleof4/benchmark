const findConvexHull = async (pts) => {
  const { default: _ } = await import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm')
  const s = _.sortBy(_.uniqWith(pts, _.isEqual), ['x', 'y'])
  if (s.length < 3) return s
  const k = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)
  const m = (v) => {
    const h = []
    for (const p of v) {
      while (h.length >= 2 && k(h[h.length - 2], h[h.length - 1], p) <= 0) h.pop()
      h.push(p)
    }
    return h
  }
  const l = m(s), u = m(s.reverse())
  return l.slice(0, -1).concat(u.slice(0, -1))
}
export default findConvexHull;