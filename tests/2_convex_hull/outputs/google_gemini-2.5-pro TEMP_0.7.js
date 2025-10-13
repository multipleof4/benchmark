async function findConvexHull(points) {
  const _ = await import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm');

  const uniqueSortedPoints = _.sortBy(
    _.uniqBy(points, p => `${p.x}:${p.y}`),
    ['x', 'y']
  );

  if (uniqueSortedPoints.length < 3) {
    return uniqueSortedPoints;
  }

  const crossProduct = (p1, p2, p3) =>
    (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);

  const buildHalfHull = pts => {
    const half = [];
    for (const p of pts) {
      while (half.length >= 2 && crossProduct(half.at(-2), half.at(-1), p) <= 0) {
        half.pop();
      }
      half.push(p);
    }
    return half;
  };

  const lower = buildHalfHull(uniqueSortedPoints);
  const upper = buildHalfHull([...uniqueSortedPoints].reverse());

  const ccwHull = lower.slice(0, -1).concat(upper.slice(0, -1));

  return [ccwHull[0], ...ccwHull.slice(1).reverse()];
}
export default findConvexHull;