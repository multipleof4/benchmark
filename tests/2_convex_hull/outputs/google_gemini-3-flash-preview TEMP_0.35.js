export const findConvexHull = async (points) => {
  const _ = await import('https://cdn.jsdelivr.net/npm/lodash-es/+esm');
  const sorted = _.sortBy(_.uniqWith(points, _.isEqual), ['x', 'y']);

  if (sorted.length < 3) return sorted;

  const buildChain = (pts) => {
    const hull = [];
    for (const p of pts) {
      while (hull.length >= 2) {
        const a = hull[hull.length - 2];
        const b = hull[hull.length - 1];
        if ((b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x) > 0) break;
        hull.pop();
      }
      hull.push(p);
    }
    return hull;
  };

  const lower = buildChain(sorted);
  const upper = buildChain([...sorted].reverse());

  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
};
export default findConvexHull;
// Generation time: 17.558s
// Result: PASS