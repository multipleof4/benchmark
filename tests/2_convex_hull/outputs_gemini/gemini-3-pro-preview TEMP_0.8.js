const findConvexHull = async (pts) => {
  const { default: _ } = await import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm');
  const s = _.sortBy(_.uniqWith(pts, _.isEqual), ['x', 'y']);
  
  if (s.length < 3) return s;

  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const h = [];

  for (let i = 0; i < s.length; i++) {
    while (h.length >= 2 && cross(h[h.length - 2], h[h.length - 1], s[i]) <= 0) h.pop();
    h.push(s[i]);
  }

  const t = h.length + 1;
  for (let i = s.length - 2; i >= 0; i--) {
    while (h.length >= t && cross(h[h.length - 2], h[h.length - 1], s[i]) <= 0) h.pop();
    h.push(s[i]);
  }

  h.pop();
  return h;
};
export default findConvexHull;