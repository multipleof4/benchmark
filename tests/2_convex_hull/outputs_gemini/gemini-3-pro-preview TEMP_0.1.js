const findConvexHull = async (P) => {
  const { default: _ } = await import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm');
  
  const U = _.uniqWith(P, _.isEqual);
  if (U.length < 3) return U;
  
  const S = _.sortBy(U, ['x', 'y']);
  
  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  
  const build = (list) => {
    const h = [];
    list.forEach(p => {
      while (h.length >= 2 && cross(h[h.length - 2], h[h.length - 1], p) <= 0) h.pop();
      h.push(p);
    });
    return h;
  };

  const l = build(S);
  const u = build([...S].reverse());

  return [...l.slice(0, -1), ...u.slice(0, -1)];
};
export default findConvexHull;