const findConvexHull = async (points) => {
  const { default: _ } = await import('https://esm.sh/lodash');
  const P = _.sortBy(_.uniqWith(points, _.isEqual), ['x', 'y']);
  if (P.length < 3) return P;

  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const h = [];

  for (const p of P) {
    while (h.length >= 2 && cross(h[h.length - 2], h[h.length - 1], p) <= 0) h.pop();
    h.push(p);
  }

  const t = h.length + 1;
  for (let i = P.length - 2; i >= 0; i--) {
    while (h.length >= t && cross(h[h.length - 2], h[h.length - 1], P[i]) <= 0) h.pop();
    h.push(P[i]);
  }

  h.pop();
  return h;
};
export default findConvexHull;