const findShortestPath = async (g, s, e) => {
  const { default: P } = await import('https://esm.sh/js-priority-queue');
  const q = new P({ comparator: (a, b) => a.w - b.w }), m = { [s]: 0 };
  q.queue({ n: s, w: 0 });

  while (q.length) {
    const { n, w } = q.dequeue();
    if (n === e) return w;
    if (w > (m[n] ?? 1 / 0)) continue;

    for (const [k, v] of Object.entries(g[n] || {})) {
      const t = w + v;
      if (t < (m[k] ?? 1 / 0)) {
        m[k] = t;
        q.queue({ n: k, w: t });
      }
    }
  }
  return 1 / 0;
};
export default findShortestPath;