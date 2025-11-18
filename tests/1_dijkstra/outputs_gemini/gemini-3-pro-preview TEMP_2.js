const findShortestPath = async (g, s, e) => {
  const { default: PQ } = await import('https://esm.sh/js-priority-queue')
  const q = new PQ({ comparator: (a, b) => a.d - b.d })
  const m = { [s]: 0 }
  
  q.queue({ n: s, d: 0 })

  while (q.length) {
    const { n, d } = q.dequeue()
    if (n === e) return d
    if (d > (m[n] ?? 1 / 0)) continue

    const adj = g[n] || {}
    for (const k in adj) {
      const v = d + adj[k]
      if (v < (m[k] ?? 1 / 0)) {
        m[k] = v
        q.queue({ n: k, d: v })
      }
    }
  }

  return 1 / 0
}
export default findShortestPath;