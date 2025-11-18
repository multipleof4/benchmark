const findConvexHull = async (pts) => {
  const { default: _ } = await import('https://esm.sh/lodash');
  const u = _.uniqWith(pts, _.isEqual);
  if (u.length < 3) return u;
  const s = _.sortBy(u, ['x', 'y']);
  const k = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  const f = (l) => {
    const h = [];
    for (const p of l) {
      while (h.length >= 2 && k(h[h.length - 2], h[h.length - 1], p) <= 0) h.pop();
      h.push(p);
    }
    return h;
  };
  const l = f(s);
  const h = f([...s].reverse());
  return [...l.slice(0, -1), ...h.slice(0, -1)];
};
export default findConvexHull;