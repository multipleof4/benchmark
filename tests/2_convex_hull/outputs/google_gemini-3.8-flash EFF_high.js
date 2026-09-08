export async function findConvexHull(points) {
  const { sortBy, uniqWith, isEqual } = await import('https://cdn.jsdelivr.net/npm/lodash-es/+esm');
  
  const pts = sortBy(uniqWith(points, isEqual), ['x', 'y']);
  if (pts.length <= 2) return pts;

  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  
  const buildHull = (pList) => pList.reduce((hull, p) => {
    while (hull.length >= 2 && cross(hull[hull.length - 2], hull[hull.length - 1], p) <= 0) {
      hull.pop();
    }
    return hull.push(p), hull;
  }, []);

  const lower = buildHull(pts);
  const upper = buildHull([...pts].reverse());

  return lower.slice(0, -1).concat(upper.slice(0, -1));
}
export default findConvexHull;
// Generation time: 25.877s
// Result: PASS