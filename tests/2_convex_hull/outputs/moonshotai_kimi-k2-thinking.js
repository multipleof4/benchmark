async function findConvexHull(pts) {
  if (!Array.isArray(pts)) return [];
  const { default: _ } = await import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js');
  const points = _.sortBy(_.uniqWith(pts, (a, b) => a.x === b.x && a.y === b.y), ['x', 'y']);
  if (points.length < 3) return points;
  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const build = (h, p) => {
    while (h.length >= 2 && cross(h[h.length - 2], h[h.length - 1], p) <= 0) h.pop();
    h.push(p);
  };
  const lower = [], upper = [];
  for (const p of points) build(lower, p);
  for (let i = points.length; i--; ) build(upper, points[i]);
  lower.pop();
  upper.pop();
  return lower.concat(upper);
}
export default findConvexHull;