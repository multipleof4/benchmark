async function findConvexHull(points) {
  const { sortBy, uniqWith } = await import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.js');
  
  if (points.length < 3) return points;
  
  const sorted = sortBy(uniqWith(points, (a, b) => a.x === b.x && a.y === b.y), ['x', 'y']);
  
  if (sorted.length < 3) return sorted;
  
  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  
  const buildHull = pts => {
    const hull = [];
    for (const p of pts) {
      while (hull.length >= 2 && cross(hull[hull.length - 2], hull[hull.length - 1], p) <= 0) {
        hull.pop();
      }
      hull.push(p);
    }
    hull.pop();
    return hull;
  };
  
  return [...buildHull(sorted), ...buildHull(sorted.slice().reverse())];
}
export default findConvexHull;