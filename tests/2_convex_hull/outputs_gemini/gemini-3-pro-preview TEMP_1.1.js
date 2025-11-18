const findConvexHull = async (points) => {
  const { default: _ } = await import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm')
  const P = _.sortBy(_.uniqWith(points, _.isEqual), ['x', 'y'])
  if (P.length < 3) return P

  const xp = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)
  
  const scan = (arr) => {
    const h = []
    for (const p of arr) {
      while (h.length >= 2 && xp(h[h.length - 2], h[h.length - 1], p) <= 0) h.pop()
      h.push(p)
    }
    return h
  }

  const l = scan(P)
  const u = scan(P.reverse())
  
  return [...l.slice(0, -1), ...u.slice(0, -1)]
}
export default findConvexHull;