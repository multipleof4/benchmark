const findConvexHull = async (pts) => {
  const { default: _ } = await import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm')
  const s = _.sortBy(_.uniqWith(pts, _.isEqual), ['x', 'y'])
  if (s.length < 3) return s
  const x = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)
  const m = (l) => l.reduce((h, p) => {
    while (h.length >= 2 && x(h[h.length - 2], h[h.length - 1], p) <= 0) h.pop()
    h.push(p)
    return h
  }, [])
  const l = m(s)
  const u = m([...s].reverse())
  return [...l.slice(0, -1), ...u.slice(0, -1)]
}
export default findConvexHull;