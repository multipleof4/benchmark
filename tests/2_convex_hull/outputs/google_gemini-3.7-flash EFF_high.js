export async function findConvexHull(points) {
  if (!Array.isArray(points) || points.length <= 2) {
    return points ? [...points] : [];
  }

  const { orderBy, uniqWith, isEqual } = await import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.js');
  const pts = orderBy(uniqWith(points, isEqual), ['x', 'y']);

  if (pts.length <= 2) return pts;

  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

  const chain = list =>
    list.reduce((hull, pt) => {
      while (hull.length >= 2 && cross(hull[hull.length - 2], hull[hull.length - 1], pt) <= 0) {
        hull.pop();
      }
      hull.push(pt);
      return hull;
    }, []);

  const lower = chain(pts);
  const upper = chain([...pts].reverse());

  lower.pop();
  upper.pop();

  return lower.concat(upper);
}
export default findConvexHull;
// Generation time: 12.593s
// Result: PASS