const findShortestPath = async (g, s, e) => {
  const { default: PQ } = await import('https://esm.sh/js-priority-queue');
  const q = new PQ({ compare: (a, b) => a.d - b.d });
  const m = { [s]: 0 };
  const v = new Set();
  
  q.queue({ n: s, d: 0 });

  while (q.length) {
    const { n, d: c } = q.dequeue();
    if (n === e) return c;
    if (v.has(n)) continue;
    v.add(n);

    const adj = g[n] || {};
    for (const k in adj) {
      const t = c + adj[k];
      if (t < (m[k] ?? Infinity)) {
        m[k] = t;
        q.queue({ n: k, d: t });
      }
    }
  }

  return Infinity;
};
export default findShortestPath;