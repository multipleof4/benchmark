const findShortestPath = async (g, s, e) => {
  const { default: PQ } = await import('https://esm.sh/js-priority-queue');
  const q = new PQ({ comparator: (a, b) => a.w - b.w });
  const d = { [s]: 0 };

  q.queue({ w: 0, n: s });

  while (q.length) {
    const { w, n } = q.dequeue();

    if (n === e) return w;
    if (w > (d[n] ?? 1 / 0)) continue;

    for (const v in g[n]) {
      const k = w + g[n][v];
      if (k < (d[v] ?? 1 / 0)) {
        d[v] = k;
        q.queue({ w: k, n: v });
      }
    }
  }

  return 1 / 0;
};
export default findShortestPath;