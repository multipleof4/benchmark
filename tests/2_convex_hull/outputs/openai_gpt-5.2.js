async function findConvexHull(points) {
  if (!Array.isArray(points)) throw new TypeError("points must be an array")

  const { default: _ } = await import("https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm")
  const eq = (a, b) => a.x === b.x && a.y === b.y
  const cross = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)

  const pts = _.uniqWith(_.sortBy(points, ["x", "y"]), eq)
  if (pts.length < 2) return pts.slice()

  const lower = []
  for (const p of pts) {
    while (lower.length > 1 && cross(lower.at(-2), lower.at(-1), p) <= 0) lower.pop()
    lower.push(p)
  }

  const upper = []
  for (let i = pts.length; i--;) {
    const p = pts[i]
    while (upper.length > 1 && cross(upper.at(-2), upper.at(-1), p) <= 0) upper.pop()
    upper.push(p)
  }

  lower.pop()
  upper.pop()
  return lower.concat(upper)
}
export default findConvexHull;
// Generation time: 15.278s
// Result: PASS