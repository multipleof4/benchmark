async function findConvexHull(points) {
  const _ = await import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js');
  if (points.length <= 1) return points.slice();
  let pts = _.sortBy(_.uniqWith(points, (a, b) => a.x === b.x && a.y === b.y), ['x', 'y']);
  if (pts.length <= 1) return pts;
  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  let lower = [];
  for (let p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }
  let upper = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    let p = pts[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }
  lower.pop();
  upper.pop();
  return lower.concat(upper);
}
export default findConvexHull;
// Generation time: 60.720s
// Result: FAIL