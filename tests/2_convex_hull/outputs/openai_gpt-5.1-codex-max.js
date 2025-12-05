async function findConvexHull(a) {
  const { sortBy, uniqWith, isEqual } = await import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.js');
  a = uniqWith(a, isEqual);
  if (a.length < 4) return a;
  const b = sortBy(a, [v => v.x, v => v.y]);
  const c = (o, p, q) => (p.x - o.x) * (q.y - o.y) - (p.y - o.y) * (q.x - o.x);
  const d = [];
  for (const p of b) {
    while (d.length > 1 && c(d[d.length - 2], d[d.length - 1], p) <= 0) d.pop();
    d.push(p);
  }
  const e = [];
  for (let i = b.length; i--;) {
    const p = b[i];
    while (e.length > 1 && c(e[e.length - 2], e[e.length - 1], p) <= 0) e.pop();
    e.push(p);
  }
  return uniqWith([...d, ...e], isEqual);
}
export default findConvexHull;
// Generation time: 16.314s
// Result: PASS