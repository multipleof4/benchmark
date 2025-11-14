async function findConvexHull(points) {
  const {sortBy, uniqWith} = await import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.js')
  const ps = uniqWith(sortBy(points.map(({x, y}) => ({x: +x, y: +y})), ['x', 'y']), (a, b) => a.x === b.x && a.y === b.y)
  if (ps.length < 2) return ps
  const c = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)
  const lower = []
  for (const p of ps) {
    while (lower.length > 1 && c(lower.at(-2), lower.at(-1), p) <= 0) lower.pop()
    lower.push(p)
  }
  const upper = []
  for (const p of [...ps].reverse()) {
    while (upper.length > 1 && c(upper.at(-2), upper.at(-1), p) <= 0) upper.pop()
    upper.push(p)
  }
  return lower.slice(0, -1).concat(upper.slice(0, -1))
}
export default findConvexHull;