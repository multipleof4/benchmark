const findConvexHull = async (points) => {
  const _ = await import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/+esm');

  const sortedPoints = _.sortBy(points, ['x', 'y']);
  const uniquePoints = _.uniqWith(sortedPoints, _.isEqual);

  if (uniquePoints.length < 3) {
    return uniquePoints;
  }

  const crossProduct = (p1, p2, p3) =>
    (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);

  const lower = [];
  for (const p of uniquePoints) {
    while (lower.length >= 2 && crossProduct(lower.at(-2), lower.at(-1), p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }

  const upper = [];
  for (let i = uniquePoints.length - 1; i >= 0; i--) {
    const p = uniquePoints[i];
    while (upper.length >= 2 && crossProduct(upper.at(-2), upper.at(-1), p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }

  const hull = [...lower.slice(0, -1), ...upper.slice(0, -1)];

  return hull.reverse();
};
export default findConvexHull;