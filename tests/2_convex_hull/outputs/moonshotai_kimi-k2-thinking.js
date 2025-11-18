const findConvexHull = async (pts) => {
  const { sortBy, uniqBy } = await import('https://esm.sh/lodash-es@4');
  const cross = (a, b, c) => (b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
  const sorted = sortBy(uniqBy(pts, p => `${p.x},${p.y}`), ['x', 'y']);
  if (sorted.length < 3) return sorted;
  const lower = [], upper = [];
  for (const p of sorted) {
    while (lower.length > 1 && cross(lower[lower.length-2], lower[lower.length-1], p) <= 0) lower.pop();
    lower.push(p);
  }
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i];
    while (upper.length > 1 && cross(upper[upper.length-2], upper[upper.length-1], p) <= 0) upper.pop();
    upper.push(p);
  }
  lower.pop(); upper.pop();
  return [...lower, ...upper];
};
export default findConvexHull;