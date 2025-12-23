const findConvexHull = async (pts) => {
  const { sortBy, uniqWith, isEqual } = await import('https://cdn.skypack.dev/lodash');
  const s = sortBy(uniqWith(pts, isEqual), ['x', 'y']);
  if (s.length < 2) return s;

  const cp = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  const l = [];
  const u = [];

  for (const p of s) {
    while (l.length >= 2 && cp(l[l.length - 2], l[l.length - 1], p) <= 0) l.pop();
    l.push(p);
  }

  for (let i = s.length - 1; i >= 0; i--) {
    const p = s[i];
    while (u.length >= 2 && cp(u[u.length - 2], u[u.length - 1], p) <= 0) u.pop();
    u.push(p);
  }

  u.pop();
  l.pop();
  return l.concat(u);
};
export default findConvexHull;
// Generation time: 55.287s
// Result: PASS