async const findConvexHull = async (points) => {
  const { sortBy, uniqWith, isEqual } = await import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.min.js');

  const cross = (p1, p2, p3) =>
    (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);

  const sortedPoints = sortBy(uniqWith(points, isEqual), ['x', 'y']);

  if (sortedPoints.length <= 3) {
    return sortedPoints;
  }

  const buildHull = (pointSet) => {
    const hull = [];
    for (const p of pointSet) {
      while (hull.length >= 2 && cross(hull[hull.length - 2], hull[hull.length - 1], p) <= 0) {
        hull.pop();
      }
      hull.push(p);
    }
    return hull;
  };

  const lower = buildHull(sortedPoints);
  const upper = buildHull([...sortedPoints].reverse());

  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
};
export default findConvexHull;