const findConvexHull = async (p) => {
  const { default: _ } = await import('https://cdn.skypack.dev/lodash');
  const s = _.sortBy(_.uniqWith(p, _.isEqual), ['x', 'y']);
  if (s.length < 3) return s;

  const x = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  const h = [];

  for (const i of s) {
    while (h.length >= 2 && x(h[h.length - 2], h[h.length - 1], i) <= 0) h.pop();
    h.push(i);
  }

  const t = h.length + 1;
  for (let i = s.length - 2; i >= 0; i--) {
    const k = s[i];
    while (h.length >= t && x(h[h.length - 2], h[h.length - 1], k) <= 0) h.pop();
    h.push(k);
  }

  h.pop();
  return h;
};
export default findConvexHull;