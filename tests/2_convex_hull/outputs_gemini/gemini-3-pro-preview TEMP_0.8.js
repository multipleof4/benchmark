const findConvexHull = async (pts) => {
  const { default: _ } = await import('https://esm.sh/lodash@4');
  const s = _.sortBy(_.uniqWith(pts, _.isEqual), ['x', 'y']);
  if (s.length < 3) return s;
  
  const k = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const add = (h, p) => {
    while (h.length > 1 && k(h[h.length - 2], h[h.length - 1], p) <= 0) h.pop();
    h.push(p);
  };

  const l = [], u = [];
  s.forEach(p => add(l, p));
  for (let i = s.length - 1; i >= 0; i--) add(u, s[i]);
  
  l.pop(); u.pop();
  return [...l, ...u];
};
export default findConvexHull;