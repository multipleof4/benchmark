const findConvexHull = async (points) => {
  const _ = await import('https://cdn.skypack.dev/lodash');
  const sorted = _.uniqBy(points, p => `${p.x},${p.y}`).sort((a, b) => a.x - b.x || a.y - b.y);
  if (sorted.length < 3) return sorted;
  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const buildHull = (pts) => {
    const hull = [];
    for (const p of pts) {
      while (hull.length >= 2 && cross(hull[hull.length - 2], hull[hull.length - 1], p) <= 0) hull.pop();
      hull.push(p);
    }
    hull.pop();
    return hull;
  };
  const lower = buildHull(sorted);
  const upper = buildHull(sorted.reverse());
  return lower.concat(upper);
};
export default findConvexHull;
// Generation time: 9.132s
// Result: PASS