async function findConvexHull(points) {
  const { default: _ } = await import('https://cdn.jsdelivr.net/npm/lodash@4/esm/lodash.js');
  
  if (!points || points.length < 3) return [...(points || [])];
  
  const pts = _.sortBy(_.uniqWith(points, (a, b) => a.x === b.x && a.y === b.y), ['x', 'y']);
  
  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  
  const build = arr => {
    const h = [];
    for (const p of arr) {
      while (h.length >= 2 && cross(h[h.length - 2], h[h.length - 1], p) <= 0) h.pop();
      h.push(p);
    }
    return h;
  };
  
  const lower = build(pts);
  const upper = build([...pts].reverse());
  
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}
export default findConvexHull;