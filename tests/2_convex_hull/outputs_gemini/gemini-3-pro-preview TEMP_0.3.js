const findConvexHull = async (pts) => {
  const { default: _ } = await import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm');
  
  if (!Array.isArray(pts)) throw new Error('Input must be an array');
  const u = _.uniqWith(pts, _.isEqual);
  if (u.length < 3) return u;

  const s = _.sortBy(u, ['x', 'y']);
  const k = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  const h = [];

  for (const p of s) {
    while (h.length >= 2 && k(h[h.length - 2], h[h.length - 1], p) <= 0) h.pop();
    h.push(p);
  }

  const t = h.length + 1;
  for (let i = s.length - 2; i >= 0; i--) {
    const p = s[i];
    while (h.length >= t && k(h[h.length - 2], h[h.length - 1], p) <= 0) h.pop();
    h.push(p);
  }

  h.pop();
  return h;
};
export default findConvexHull;