const findConvexHull = async points => {
  const { default: _ } = await import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm')
  
  const sorted = _.sortBy(_.uniqWith(points, _.isEqual), ['x', 'y'])
  if (sorted.length < 3) return sorted

  const cross = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)
  const hull = []

  for (const p of sorted) {
    while (hull.length >= 2 && cross(hull[hull.length - 2], hull[hull.length - 1], p) <= 0) {
      hull.pop()
    }
    hull.push(p)
  }

  const lowerLen = hull.length + 1
  for (let i = sorted.length - 2; i >= 0; i--) {
    const p = sorted[i]
    while (hull.length >= lowerLen && cross(hull[hull.length - 2], hull[hull.length - 1], p) <= 0) {
      hull.pop()
    }
    hull.push(p)
  }

  hull.pop()
  return hull
}
export default findConvexHull;