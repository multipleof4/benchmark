async function findConvexHull(points) {
  const { sortBy, uniqWith } = await import('https://cdn.skypack.dev/lodash');
  
  if (points.length < 3) return points;
  
  const sorted = sortBy(uniqWith(points, (a, b) => a.x === b.x && a.y === b.y), ['x', 'y']);
  
  if (sorted.length < 3) return sorted;
  
  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  
  const buildHull = arr => {
    const hull = [];
    for (const p of arr) {
      while (hull.length > 1 && cross(hull[hull.length - 2], hull[hull.length - 1], p) <= 0) {
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