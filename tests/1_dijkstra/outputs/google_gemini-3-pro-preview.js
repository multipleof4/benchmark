const findShortestPath = async (g, s, e) => {
  const { default: P } = await import('https://cdn.skypack.dev/js-priority-queue')
  const d = { [s]: 0 }, q = new P({ comparator: (a, b) => a.w - b.w })
  q.queue({ w: 0, n: s })
  while (q.length) {
    const { w, n } = q.dequeue()
    if (n === e) return w
    if (w > (d[n] ?? 1 / 0)) continue
    for (const v in g[n]) {
      const t = w + g[n][v]
      if (t < (d[v] ?? 1 / 0)) {
        d[v] = t
        q.queue({ w: t, n: v })
      }
    }
  }
  return 1 / 0
}
export default findShortestPath;