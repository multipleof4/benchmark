async function findConvexHull(points) {
  const _ = await import("https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm");
  
  const sortedPoints = _.sortBy([...points], ["x", "y"]);
  const uniquePoints = _.uniqWith(sortedPoints, (a, b) => a.x === b.x && a.y === b.y);
  
  if (uniquePoints.length <= 2) return uniquePoints;
  
  const crossProduct = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  
  const lower = [];
  for (const point of uniquePoints) {
    while (lower.length >= 2 && crossProduct(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) {
      lower.pop();
    }
    lower.push(point);
  }
  
  const upper = [];
  for (let i = uniquePoints.length - 1; i >= 0; i--) {
    const point = uniquePoints[i];
    while (upper.length >= 2 && crossProduct(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) {
      upper.pop();
    }
    upper.push(point);
  }
  
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}
export default findConvexHull;
// Generation time: 11.859s
// Result: FAIL