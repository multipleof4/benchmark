const findShortestPath = async (g, s, e) => {
  const { default: PQ } = await import('https://esm.sh/js-priority-queue')
  const q = new PQ({ comparator: (a, b) => a.w - b.w })
  const d = { [s]: 0 }, v = new Set()
  
  q.queue({ n: s, w: 0 })

  while (q.length) {
    const { n, w } = q.dequeue()
    if (n === e) return w
    if (v.has(n)) continue
    v.add(n)

    for (const k in g[n]) {
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