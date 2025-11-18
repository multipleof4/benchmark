const findConvexHull = async (pts) => {
  const { default: _ } = await import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm')
  const s = _.sortBy(_.uniqWith(pts, _.isEqual), ['x', 'y'])
  if (s.length < 3) return s
  
  const cross = (a, b, o) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)
  const build = (list) => {
    const h = []
    for (const p of list) {
      while (h.length >= 2 && cross(h[h.length - 1], p, h[h.length - 2]) <= 0) h.pop()
      h.push(p)
    }
    return h
  }

  const l = build(s)
  const u = build([...s].reverse())
  
  l.pop()
  u.pop()
  
  return [...l, ...u]
}
export default findConvexHull;