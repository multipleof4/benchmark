async function findConvexHull(points) {
  if (!Array.isArray(points) || points.length < 3) return points || [];
  const { default: _ } = await import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.default.min.js');
  const ps = _.uniqWith(points, (a, b) => a.x === b.x && a.y === b.y);
  if (ps.length < 3) return ps;
  const pts = _.sortBy(ps, ['x', 'y']);
  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lower = [];
  for (let p of pts) {
    for (; lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0;) lower.pop();
    lower.push(p);
  }
  const upper = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    for (; upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0;) upper.pop();
    upper.push(p);
  }
  const hull = lower.slice(0, -1).concat(upper.slice(0, -1));
  if (hull.length <= 2) return hull;
  let area = 0;
  for (let i = 0; i < hull.length; i++) {
    const j = (i + 1) % hull.length;
    area += hull[i].x * hull[j].y - hull[j].x * hull[i].y;
  }
  if (area > 0) hull.reverse();
  return hull;
}
export default findConvexHull;