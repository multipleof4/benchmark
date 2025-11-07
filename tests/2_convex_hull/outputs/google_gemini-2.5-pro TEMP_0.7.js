async function findConvexHull(points) {
  const _ = await import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js');

  const sortedUniquePoints = _.uniqWith(_.sortBy(points, ['x', 'y']), _.isEqual);

  if (sortedUniquePoints.length < 3) {
    return sortedUniquePoints;
  }

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

  const lowerHull = buildHalfHull(sortedUniquePoints);
  const upperHull = buildHalfHull([...sortedUniquePoints].reverse());

  return [...upperHull.slice(0, -1), ...lowerHull.slice(0, -1)];
}
export default findConvexHull;