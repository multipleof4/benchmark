export const findConvexHull = async (points) => {
  const _ = (await import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/+esm')).default;
  const sorted = _.sortBy(_.uniqWith(points, _.isEqual), ['x', 'y']);

  if (sorted.length < 3) return sorted;

  const crossProduct = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);

  const buildChain = (arr) => {
    const chain = [];
    for (const p of arr) {
      while (chain.length >= 2 && crossProduct(chain[chain.length - 2], chain[chain.length - 1], p) <= 0) {
        chain.pop();
      }
      chain.push(p);
    }
    return chain;
  };

  const lower = buildChain(sorted);
  const upper = buildChain([...sorted].reverse());

  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
};
export default findConvexHull;
// Generation time: 12.985s
// Result: PASS