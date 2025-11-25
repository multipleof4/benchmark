const findConvexHull = async points => {
  const { sortBy, uniqWith, isEqual } = await import('https://cdn.skypack.dev/lodash')

  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)

  const preparePoints = pts => {
    const unique = uniqWith(pts, isEqual)
    return sortBy(unique, ['x', 'y'])
  }

  const buildHull = pts => {
    const hull = []

    for (const p of pts) {
      while (hull.length >= 2 && cross(hull[hull.length - 2], hull[hull.length - 1], p) <= 0) {
        hull.pop()
      }
      hull.push(p)
    }

    const lowerHullSize = hull.length + 1
    for (let i = pts.length - 1; i >= 0; i--) {
      const p = pts[i]
      while (hull.length >= lowerHullSize && cross(hull[hull.length - 2], hull[hull.length - 1], p) <= 0) {
        hull.pop()
      }
      hull.push(p)
    }

    hull.pop()
    return hull
  }

  if (points.length < 3) return [...points]
  const prepared = preparePoints(points)
  return buildHull(prepared)
}
export default findConvexHull;