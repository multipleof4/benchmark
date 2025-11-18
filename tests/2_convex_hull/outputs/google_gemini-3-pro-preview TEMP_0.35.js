const findConvexHull = async (pts) => {
  const { sortBy: S, uniqWith: U, isEqual: E } = await import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/+esm')
  const p = S(U(pts, E), ['x', 'y'])
  if (p.length < 3) return p
  const X = (a, b, o) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)
  const B = (list) => {
    const h = []
    for (const pt of list) {
      while (h.length >= 2 && X(h[h.length - 1], pt, h[h.length - 2]) <= 0) h.pop()
      h.push(pt)
    }
    return h
  }
  const l = B(p)
  const u = B(p.reverse())
  l.pop()
  u.pop()
  return l.concat(u)
}
export default findConvexHull;