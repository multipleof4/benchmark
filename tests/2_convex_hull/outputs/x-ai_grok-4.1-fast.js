async function findConvexHull(pts) {
  const { sortBy, uniqBy } = await import('https://cdn.skypack.dev/lodash-es');
  const ps = uniqBy(pts, p => `${p.x},${p.y}`);
  if (ps.length < 2) return ps;
  const sorted = sortBy(ps, ['x', 'y']);
  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const build = (pnts) => {
    const h = [];
    for (let p of pnts) {
      while (h.length > 1 && cross(h[h.length - 2], h.at(-1), p) <= 0) h.pop();
      h.push(p);
    }
    return h;
  };
  const lower = build(sorted);
  const upper = build([...sorted].reverse());
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}
export default findConvexHull;