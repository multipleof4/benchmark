async function findConvexHull(points) {
  const { sortBy, uniqWith } = await import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.js');
  
  if (points.length < 3) return points;
  
  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  
  const sorted = sortBy(uniqWith(points, (a, b) => a.x === b.x && a.y === b.y), ['x', 'y']);
  
  if (sorted.length < 3) return sorted;
  
  const lower = [];
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }
  
  const upper = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }
  
  lower.pop();
  upper.pop();
  
  return lower.concat(upper);
}
export default findConvexHull;