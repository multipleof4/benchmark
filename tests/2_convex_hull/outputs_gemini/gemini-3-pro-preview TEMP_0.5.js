const findConvexHull = async (pts) => {
  const { default: _ } = await import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm')
  const u = _.uniqWith(pts, _.isEqual)
  if (u.length < 3) return u
  const s = _.sortBy(u, ['x', 'y'])
  const cp = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)
  const scan = (lst) => lst.reduce((h, p) => {
    while (h.length >= 2 && cp(h[h.length - 2], h[h.length - 1], p) <= 0) h.pop()
    h.push(p)
    return h
  }, [])
  const l = scan(s)
  const up = scan([...s].reverse())
  return [...l.slice(0, -1), ...up.slice(0, -1)]
}
export default findConvexHull;