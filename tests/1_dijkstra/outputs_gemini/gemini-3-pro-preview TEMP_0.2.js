const findShortestPath = async (g, s, e) => {
  const { default: Q } = await import('https://esm.sh/js-priority-queue')
  const d = { [s]: 0 }, q = new Q({ comparator: (a, b) => a[1] - b[1] })
  q.queue([s, 0])

  while (q.length) {
    const [u, w] = q.dequeue()
    if (u === e) return w
    if (w > (d[u] ?? 1/0)) continue

    for (let v in g[u]) {
      const k = w + g[u][v]
      if (k < (d[v] ?? 1/0)) {
        d[v] = k
        q.queue([v, k])
      }
    }
  }
  return 1/0
}
export default findShortestPath;