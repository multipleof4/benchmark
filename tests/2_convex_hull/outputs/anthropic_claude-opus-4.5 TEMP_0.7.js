const findConvexHull = async (points) => {
  const _ = (await import("https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.min.js")).default;
  
  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  
  const unique = _.uniqWith(points, _.isEqual);
  const sorted = _.sortBy(unique, ["x", "y"]);
  
  if (sorted.length < 3) return sorted;
  
  const lower = [];
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0)
      lower.pop();
    lower.push(p);
  }
  
  const upper = [];
  for (const p of _.reverse([...sorted])) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0)
      upper.pop();
    upper.push(p);
  }
  
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
};
export default findConvexHull;