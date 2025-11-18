const findShortestPath = async (g, s, e) => {
  const { default: Q } = await import('https://cdn.skypack.dev/js-priority-queue')
  const q = new Q({ comparator: (a, b) => a.d - b.d })
  const m = { [s]: 0 }

  q.queue({ n: s, d: 0 })

  while (q.length) {
    const { n, d } = q.dequeue()
    
    if (n === e) return d
    if (d > (m[n] ?? 1/0)) continue

    for (const v in g[n]) {
      const t = d + g[n][v]
      if (t < (m[v] ?? 1/0)) {
        m[v] = t
        q.queue({ n: v, d: t })
      }
    }
  }
  return 1/0
}
export default findShortestPath;