export const findConvexHull = async (points) => {
  const { default: _ } = await import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm');
  const P = _.sortBy(_.uniqWith(points, _.isEqual), ['x', 'y']);
  
  if (P.length < 3) return P;

  const cross = (a, b, o) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  
  const buildChain = (nodes) => {
    const hull = [];
    for (const p of nodes) {
      while (hull.length >= 2 && cross(hull[hull.length - 1], p, hull[hull.length - 2]) <= 0) {
        hull.pop();
      }
      hull.push(p);
    }
    return hull;
  };

  const lower = buildChain(P);
  const upper = buildChain([...P].reverse());

  lower.pop();
  upper.pop();

  return [...lower, ...upper];
};
export default findConvexHull;