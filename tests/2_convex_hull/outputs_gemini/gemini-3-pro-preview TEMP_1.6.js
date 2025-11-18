export const findConvexHull = async (pts) => {
  const { default: _ } = await import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm')
  const S = _.sortBy(_.uniqWith(pts, _.isEqual), ['x', 'y'])
  if (S.length < 3) return S
  
  const cross = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)
  const chain = (list) => {
    const h = []
    for (const p of list) {
      while (h.length >= 2 && cross(h[h.length - 2], h[h.length - 1], p) <= 0) h.pop()
      h.push(p)
    }
    return h
  }

  const l = chain(S)
  const u = chain([...S].reverse())
  
  l.pop()
  u.pop()
  return l.concat(u)
}
export default findConvexHull;