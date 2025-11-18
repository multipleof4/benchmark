const findConvexHull = async (rawPoints) => {
  const { default: _ } = await import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm')
  const pts = _.sortBy(_.uniqWith(rawPoints, _.isEqual), ['x', 'y'])
  if (pts.length < 3) return pts
  
  const cross = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)
  
  const build = (list) => {
    const h = []
    list.forEach(p => {
      while (h.length >= 2 && cross(h[h.length - 2], h[h.length - 1], p) <= 0) h.pop()
      h.push(p)
    })
    return h
  }

  const lower = build(pts)
  const upper = build([...pts].reverse())
  
  lower.pop(), upper.pop()
  return [...lower, ...upper]
}
export default findConvexHull;