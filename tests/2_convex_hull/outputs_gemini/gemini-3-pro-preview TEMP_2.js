const findConvexHull = async (pts) => {
  const _ = (await import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm')).default;
  const u = _.uniqWith(pts, _.isEqual);
  if (u.length < 3) return u;
  const s = _.sortBy(u, ['x', 'y']);
  const k = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  const b = (list, h = []) => {
    for (const p of list) {
      while (h.length > 1 && k(h[h.length - 2], h[h.length - 1], p) <= 0) h.pop();
      h.push(p);
    }
    return h;
  };
  const l = b(s);
  const r = b(s.reverse());
  return l.slice(0, -1).concat(r.slice(0, -1));
};
export default findConvexHull;