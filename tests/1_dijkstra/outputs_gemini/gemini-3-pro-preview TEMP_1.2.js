const findShortestPath = async (g, s, e) => {
  const { default: P } = await import('https://cdn.skypack.dev/js-priority-queue')
  const d = { [s]: 0 }, q = new P({ compare: (a, b) => a.w - b.w })
  q.queue({ id: s, w: 0 })
  while (q.length) {
    const { id, w } = q.dequeue()
    if (id === e) return w
    if (w > (d[id] ?? 1 / 0)) continue
    for (let n in g[id]) {
      const k = w + g[id][n]
      if (k < (d[n] ?? 1 / 0)) {
        d[n] = k
        q.queue({ id: n, w: k })
      }
    }
  }
  return 1 / 0
}
export default findShortestPath;