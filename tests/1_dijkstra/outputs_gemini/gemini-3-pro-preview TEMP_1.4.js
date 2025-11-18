const findShortestPath = async (g, s, e) => {
  const { default: PQ } = await import('https://cdn.jsdelivr.net/npm/js-priority-queue@0.1.5/+esm')
  const q = new PQ({ comparator: (a, b) => a.d - b.d })
  const D = { [s]: 0 }
  
  q.queue({ n: s, d: 0 })

  while (q.length) {
    const { n, d } = q.dequeue()
    
    if (n === e) return d
    if (d > (D[n] ?? 1 / 0)) continue

    for (const [v, w] of Object.entries(g[n] || {})) {
      const c = d + w
      if (c < (D[v] ?? 1 / 0)) {
        D[v] = c
        q.queue({ n: v, d: c })
      }
    }
  }

  return 1 / 0
}
export default findShortestPath;