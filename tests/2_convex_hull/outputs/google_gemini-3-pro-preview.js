const findConvexHull = async (pts) => {
  const { default: _ } = await import('https://cdn.skypack.dev/lodash');
  
  const P = _.sortBy(_.uniqWith(pts, _.isEqual), ['x', 'y']);
  const n = P.length, k = [], C = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  
  if (n < 3) return P;

  for (let i = 0; i < n; i++) {
    while (k.length >= 2 && C(k[k.length - 2], k[k.length - 1], P[i]) <= 0) k.pop();
    k.push(P[i]);
  }

  for (let i = n - 2, t = k.length + 1; i >= 0; i--) {
    while (k.length >= t && C(k[k.length - 2], k[k.length - 1], P[i]) <= 0) k.pop();
    k.push(P[i]);
  }

  k.pop();
  return k;
};
export default findConvexHull;