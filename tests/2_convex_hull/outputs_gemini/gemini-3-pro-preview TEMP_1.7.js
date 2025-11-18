const findConvexHull = async (points) => {
  const { default: _ } = await import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm');
  const sorted = _.sortBy(_.uniqWith(points, _.isEqual), ['x', 'y']);

  if (sorted.length < 3) return sorted;

  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

  const scan = (list) => list.reduce((h, p) => {
    while (h.length > 1 && cross(h[h.length - 2], h[h.length - 1], p) <= 0) h.pop();
    return h.push(p), h;
  }, []);

  const lower = scan(sorted);
  const upper = scan([...sorted].reverse());

  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
};
export default findConvexHull;