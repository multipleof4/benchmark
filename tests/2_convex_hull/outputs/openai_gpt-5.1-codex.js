async function findConvexHull(points) {
  const { uniqWith, isEqual, sortBy } = await import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.js')
  const pts = sortBy(uniqWith(points, isEqual), ['x', 'y'])
  if (pts.length < 3) return pts
  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)
  const scan = (src, acc = []) => {
    src.forEach(p => {
      while (acc.length > 1 && cross(acc.at(-2), acc.at(-1), p) <= 0) acc.pop()
      acc.push(p)
    })
    return acc
  }
  const lower = scan(pts)
  const upper = scan([...pts].reverse())
  lower.pop()
  upper.pop()
  return lower.concat(upper)
}
export default findConvexHull;