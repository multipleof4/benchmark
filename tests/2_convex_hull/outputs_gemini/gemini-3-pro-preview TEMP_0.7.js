const findConvexHull = async (points) => {
  const { default: _ } = await import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm');
  const sorted = _.sortBy(_.uniqWith(points, _.isEqual), ['x', 'y']);
  
  if (sorted.length < 3) return sorted;

  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  
  const buildHull = (list) => {
    const hull = [];
    list.forEach(p => {
      while (hull.length >= 2 && cross(hull[hull.length - 2], hull[hull.length - 1], p) <= 0) hull.pop();
      hull.push(p);
    });
    return hull;
  };

  const lower = buildHull(sorted);
  const upper = buildHull([...sorted].reverse());

  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
};
export default findConvexHull;