async function findConvexHull(points) {
  const _ = await import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm');

  const uniquePoints = _.uniqWith(points, _.isEqual);

  if (uniquePoints.length < 3) {
    return uniquePoints;
  }

  const sorted = _.sortBy(uniquePoints, ['x', 'y']);

  const crossProduct = (p1, p2, p3) =>
    (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);

  const buildHalfHull = (pts) => {
    const hull = [];
    for (const p of pts) {
      while (hull.length >= 2 && crossProduct(hull.at(-2), hull.at(-1), p) <= 0) {
        hull.pop();
      }
      hull.push(p);
    }
    return hull;
  };

  const lower = buildHalfHull(sorted);
  const upper = buildHalfHull([...sorted].reverse());

  const hull = [...lower.slice(0, -1), ...upper.slice(0, -1)];

  return [hull[0], ...hull.slice(1).reverse()];
}
export default findConvexHull;