const findShortestPath = async (g, s, e) => {
  const { default: P } = await import('https://esm.sh/js-priority-queue');
  const q = new P({ comparator: (a, b) => a.w - b.w }), d = { [s]: 0 };
  q.queue({ n: s, w: 0 });
  while (q.length) {
    const { n, w } = q.dequeue();
    if (n === e) return w;
    if (w > (d[n] ?? 1 / 0)) continue;
    for (const k in g[n] || {}) {
      const t = w + g[n][k];
      if (t < (d[k] ?? 1 / 0)) {
        d[k] = t;
        q.queue({ n: k, w: t });
      }
    }
  }
  return 1 / 0;
};
export default findShortestPath;