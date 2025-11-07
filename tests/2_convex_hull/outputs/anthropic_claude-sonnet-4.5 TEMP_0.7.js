async function findConvexHull(points) {
  const _ = await import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.min.js').then(m => m.default);
  
  if (points.length < 3) return points;
  
  const sorted = _.sortBy(_.uniqWith(points, _.isEqual), ['x', 'y']);
  
  if (sorted.length < 3) return sorted;
  
  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  
  const buildHull = arr => {
    const hull = [];
    for (const p of arr) {
      while (hull.length >= 2 && cross(hull[hull.length - 2], hull[hull.length - 1], p) <= 0) {
        hull.pop();
      }
      hull.push(p);
    }
    hull.pop();
    return hull;
  };
  
  const lower = buildHull(sorted);
  const upper = buildHull([...sorted].reverse());
  
  return [...lower, ...upper].reverse();
}
export default findConvexHull;