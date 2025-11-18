const findShortestPath = async (g, s, e) => {
  const { default: PQ } = await import('https://cdn.jsdelivr.net/npm/js-priority-queue@0.1.5/+esm')
  const q = new PQ({ comparator: (a, b) => a.w - b.w }), d = { [s]: 0 }
  q.queue({ n: s, w: 0 })
  while (q.length) {
    const { n, w } = q.dequeue()
    if (n === e) return w
    if (w > (d[n] ?? 1 / 0)) continue
    for (const v in g[n]) {
      const k = w + g[n][v]
      if (k < (d[v] ?? 1 / 0)) {
        d[v] = k
        q.queue({ n: v, w: k })
      }
    }
  }
  return 1 / 0
}
export default findShortestPath;