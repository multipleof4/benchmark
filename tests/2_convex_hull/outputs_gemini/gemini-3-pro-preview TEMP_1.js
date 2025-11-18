const findConvexHull = async (points) => {
  if (!Array.isArray(points)) throw new Error('Input must be an array');
  
  const { default: _ } = await import('https://esm.sh/lodash');
  
  const uniq = _.uniqWith(points, _.isEqual);
  if (uniq.length < 3) return uniq;
  
  const sorted = _.sortBy(uniq, ['x', 'y']);
  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  
  const build = (list) => {
    const hull = [];
    for (const p of list) {
      while (hull.length >= 2 && cross(hull[hull.length - 2], hull[hull.length - 1], p) <= 0) {
        hull.pop();
      }
      hull.push(p);
    }
    return hull;
  };

  const lower = build(sorted);
  const upper = build([...sorted].reverse());
  
  lower.pop();
  upper.pop();
  
  return [...lower, ...upper];
};
export default findConvexHull;