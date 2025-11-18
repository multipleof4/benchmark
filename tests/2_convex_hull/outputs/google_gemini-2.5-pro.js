const findConvexHull = async (points) => {
  const _ = await import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js');

  const uniquePts = _.uniqWith(points, _.isEqual);
  if (uniquePts.length < 3) {
    return uniquePts;
  }

  const crossProduct = (o, a, b) =>
    (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

  const sortedPts = _.sortBy(uniquePts, ['x', 'y']);

  const buildHalfHull = (pts) =>
    pts.reduce((hull, p) => {
      while (hull.length >= 2 && crossProduct(hull.at(-2), hull.at(-1), p) <= 0) {
        hull.pop();
      }
      hull.push(p);
      return hull;
    }, []);

  const lower = buildHalfHull(sortedPts);
  const upper = buildHalfHull([...sortedPts].reverse());

  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
};
export default findConvexHull;