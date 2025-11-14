const findConvexHull = async (points) => {
  const { sortBy, uniqWith, isEqual } =
    await import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.js');

  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

  const pts = sortBy(uniqWith(points, isEqual), ['x', 'y']);

  if (pts.length < 3) return pts;

  const lower = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower.at(-2), lower.at(-1), p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }

  const upper = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (upper.length >= 2 && cross(upper.at(-2), upper.at(-1), p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }

  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
};
export default findConvexHull;