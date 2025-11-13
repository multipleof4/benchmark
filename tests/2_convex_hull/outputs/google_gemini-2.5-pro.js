async function findConvexHull(points) {
  const { sortBy, uniqWith, isEqual } = await import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.min.js');

  const uniquePoints = uniqWith(points, isEqual);
  if (uniquePoints.length < 3) {
    return uniquePoints;
  }

  const sortedPoints = sortBy(uniquePoints, ['x', 'y']);

  const crossProduct = (p1, p2, p3) =>
    (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);

  const buildHull = pts => pts.reduce((hull, p) => {
    while (hull.length >= 2 && crossProduct(hull.at(-2), hull.at(-1), p) <= 0) {
      hull.pop();
    }
    hull.push(p);
    return hull;
  }, []);

  const lower = buildHull(sortedPoints);
  const upper = buildHull([...sortedPoints].reverse());

  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}
export default findConvexHull;