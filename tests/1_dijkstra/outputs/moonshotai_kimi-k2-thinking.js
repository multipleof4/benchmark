let PQ;
export async function findShortestPath(g, s, e) {
  if (!(s in g) || !(e in g)) return Infinity;
  if (!PQ) ({ default: PQ } = await import('https://cdn.skypack.dev/js-priority-queue@0.1.5'));
  const d = new Map([[s, 0]]);
  const q = new PQ({ comparator: (a, b) => a[1] - b[1] });
  const v = new Set();
  q.queue([s, 0]);
  while (q.length) {
    const [n, c] = q.dequeue();
    if (n === e) return c;
    if (v.has(n)) continue;
    v.add(n);
    if (c > (d.get(n) ?? Infinity)) continue;
    for (const [p, w] of Object.entries(g[n] || {})) {
      const t = c + w;
      if (t < (d.get(p) ?? Infinity)) {
        d.set(p, t);
        q.queue([p, t]);
      }
    }
  }
  return d.get(e) ?? Infinity;
}
export default findShortestPath;
// Generation time: 95.484s
// Result: PASS