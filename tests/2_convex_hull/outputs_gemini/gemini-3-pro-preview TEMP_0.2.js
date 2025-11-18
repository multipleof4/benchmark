const findConvexHull = async (pts) => {
  const { default: _ } = await import('https://esm.sh/lodash')
  const u = _.uniqWith(pts, _.isEqual)
  if (u.length < 3) return u
  const s = _.sortBy(u, ['x', 'y'])
  const cp = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)
  const scan = (lst) => {
    const h = []
    lst.forEach(p => {
      while (h.length >= 2 && cp(h[h.length - 2], h[h.length - 1], p) <= 0) h.pop()
      h.push(p)
    })
    return h
  }
  const l = scan(s)
  const uH = scan(s.reverse())
  return _.concat(l.slice(0, -1), uH.slice(0, -1))
}
export default findConvexHull;