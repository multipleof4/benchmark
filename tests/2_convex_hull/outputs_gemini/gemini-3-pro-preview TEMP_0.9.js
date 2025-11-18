const findConvexHull = async (pts) => {
  if (!pts?.length || pts.length < 3) return pts || [];
  
  const { default: _ } = await import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm');
  
  const s = _.sortBy(_.uniqWith(pts, _.isEqual), ['x', 'y']);
  const k = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  
  const scan = (list) => {
    const h = [];
    for (const p of list) {
      while (h.length >= 2 && k(h[h.length - 2], h[h.length - 1], p) <= 0) h.pop();
      h.push(p);
    }
    return h;
  };

  const l = scan(s);
  const u = scan(s.reverse());

  return [...l.slice(0, -1), ...u.slice(0, -1)];
};
export default findConvexHull;