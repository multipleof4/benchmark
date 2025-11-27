async function findConvexHull(p) {
  const { default: _ } = await import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js'),
        u = _.uniqWith(_.sortBy(p, 'x', 'y'), (a, b) => a.x === b.x && a.y === b.y);
  if (u.length < 3) return u;
  
  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x),
        build = (pts) => {
          const h = [];
          for (const q of pts) {
            while (h.length > 1 && cross(h[h.length - 2], h[h.length - 1], q) <= 0) h.pop();
            h.push(q);
          }
          return h;
        };
  
  const l = build(u),
        r = build([...u].reverse());
  
  return [...l.slice(0, -1), ...r.slice(0, -1)];
}
export default findConvexHull;
// Generation time: 147.393s
// Result: FAIL