const findShortestPath = async (g, s, e) => {
  const { default: P } = await import('https://esm.sh/js-priority-queue');
  const q = new P({ comparator: (a, b) => a.c - b.c }), d = { [s]: 0 };
  q.queue({ n: s, c: 0 });
  while (q.length) {
    const { n, c } = q.dequeue();
    if (n === e) return c;
    if (c > (d[n] ?? 1 / 0)) continue;
    for (let v in g[n]) {
      let k = c + g[n][v];
      if (k < (d[v] ?? 1 / 0)) {
        d[v] = k;
        q.queue({ n: v, c: k });
      }
    }
  }
  return 1 / 0;
};
export default findShortestPath;