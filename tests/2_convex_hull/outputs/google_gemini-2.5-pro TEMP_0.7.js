async function findConvexHull(points) {
  const { sortBy, uniqWith, isEqual } = await import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/+esm');

  if (points.length < 3) {
    return [...points];
  }

  const crossProduct = (p1, p2, p3) =>
    (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);

  const sortedPoints = sortBy(points, ['x', 'y']);

  const buildHull = (pts) =>
    pts.reduce((hull, p) => {
      while (hull.length >= 2 && crossProduct(hull[hull.length - 2], hull.at(-1), p) <= 0) {
        hull.pop();
      }
      hull.push(p);
      return hull;
    }, []);

  const lowerHull = buildHull(sortedPoints);
  const upperHull = buildHull([...sortedPoints].reverse());

  const combinedHull = [...lowerHull, ...upperHull];

  return uniqWith(combinedHull, isEqual);
}
export default findConvexHull;