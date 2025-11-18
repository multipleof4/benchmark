const findShortestPath = async (g, s, e) => {
  const { default: Q } = await import('https://esm.sh/js-priority-queue')
  const d = { [s]: 0 }, q = new Q({ comparator: (a, b) => a.w - b.w })
  q.queue({ n: s, w: 0 })
  while (q.length) {
    const { n, w } = q.dequeue()
    if (n === e) return w
    if (w > (d[n] ?? 1 / 0)) continue
    for (const [v, c] of Object.entries(g[n] || {})) {
      const k = w + c
      if (k < (d[v] ?? 1 / 0)) {
        d[v] = k
        q.queue({ n: v, w: k })
      }
    }
  }
  return 1 / 0
}
export default findShortestPath;