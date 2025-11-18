const findConvexHull = async (pts) => {
  const { default: _ } = await import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm');
  const s = _.sortBy(_.uniqWith(pts, _.isEqual), ['x', 'y']);
  if (s.length < 3) return s;
  const k = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  const f = (h, p) => {
    while (h.length > 1 && k(h[h.length - 2], h[h.length - 1], p) <= 0) h.pop();
    h.push(p);
    return h;
  };
  return [...s.reduce(f, []).slice(0, -1), ...s.reduceRight(f, []).slice(0, -1)];
};
export default findConvexHull;