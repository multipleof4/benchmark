async function findConvexHull(points) {
  if (!Array.isArray(points) || points.length < 1) return [];
  const { default: _ } = await import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.default.min.js');
  const s = _.uniqBy(points, p => `${p.x},${p.y}`);
  if (s.length < 2) return s.slice();
  const pts = _.sortBy(s, ['x', 'y']);
  const c = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const l = [];
  for (let p of pts) {
    for (; l.length > 1 && c(l[l.length - 2], l[l.length - 1], p) <= 0;) l.pop();
    l.push(p);
  }
  const u = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    for (; u.length > 1 && c(u[u.length - 2], u[u.length - 1], p) <= 0;) u.pop();
    u.push(p);
  }
  l.pop();
  u.pop();
  return l.concat(u);
}
export default findConvexHull;