const findConvexHull = async (points) => {
  const _ = await import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.min.js');

  const sortedPoints = _.sortBy(_.uniqWith(points, _.isEqual), ['x', 'y']);

  if (sortedPoints.length < 3) {
    return sortedPoints;
  }

  const crossProduct = (p1, p2, p3) =>
    (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);

  const buildHalfHull = (pointSet) => {
    const hull = [];
    for (const p of pointSet) {
      while (hull.length >= 2 && crossProduct(hull.at(-2), hull.at(-1), p) <= 0) {
        hull.pop();
      }
      hull.push(p);
    }
    return hull;
  };

  const lower = buildHalfHull(sortedPoints);
  const upper = buildHalfHull([...sortedPoints].reverse());

  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
};
export default findConvexHull;