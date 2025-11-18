const findShortestPath = async (g, s, e) => {
  const { default: Q } = await import('https://esm.sh/js-priority-queue');
  const q = new Q({ comparator: (a, b) => a.w - b.w }), m = { [s]: 0 };
  q.queue({ n: s, w: 0 });
  while (q.length) {
    const { n, w } = q.dequeue();
    if (n === e) return w;
    if (w > (m[n] ?? 1/0)) continue;
    for (const v in g[n]) {
      const k = w + g[n][v];
      if (k < (m[v] ?? 1/0)) {
        m[v] = k;
        q.queue({ n: v, w: k });
      }
    }
  }
  return 1/0;
};
export default findShortestPath;