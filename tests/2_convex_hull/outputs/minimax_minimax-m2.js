export async function findConvexHull(points) {
  const _ = await import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/+esm');
  if (!Array.isArray(points)) points = [];
  const uniq = _.uniqWith(points, (a, b) => a.x === b.x && a.y === b.y);
  const pts = _.sortBy(uniq, p => [p.x, p.y]);
  if (pts.length <= 1) return pts.slice();
  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lower = [];
  for (const p of pts) {
    while (lower.length > 1 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (upper.length > 1 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  upper.pop();
  lower.pop();
  return lower.concat(upper);
}
export default findConvexHull;
// Generation time: 14.502s
// Result: PASS