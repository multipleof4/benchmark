const findShortestPath = async (g, s, e) => {
  const { default: PQ } = await import('https://cdn.jsdelivr.net/npm/js-priority-queue@0.1.5/+esm')
  const q = new PQ({ comparator: (a, b) => a.w - b.w })
  const d = { [s]: 0 }
  
  q.queue({ n: s, w: 0 })

  while (q.length) {
    const { n, w } = q.dequeue()
    if (n === e) return w
    if (w > (d[n] ?? Infinity)) continue

    for (const k in g[n] || {}) {
      const t = w + g[n][k]
      if (t < (d[k] ?? Infinity)) {
        d[k] = t
        q.queue({ n: k, w: t })
      }
    }
  }
  
  return Infinity
}
export default findShortestPath;
// Generation time: 30.290s
// Result: PASS