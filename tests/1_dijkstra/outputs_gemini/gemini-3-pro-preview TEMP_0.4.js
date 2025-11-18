const findShortestPath = async (g, s, e) => {
  const { default: PQ } = await import('https://esm.sh/js-priority-queue')
  const d = { [s]: 0 }, q = new PQ({ comparator: (a, b) => a.w - b.w })
  q.queue({ n: s, w: 0 })

  while (q.length) {
    const { n: u, w } = q.dequeue()
    if (u === e) return w
    if (w > (d[u] ?? 1 / 0)) continue

    for (const v in g[u]) {
      const nw = w + g[u][v]
      if (nw < (d[v] ?? 1 / 0)) {
        d[v] = nw
        q.queue({ n: v, w: nw })
      }
    }
  }
  return 1 / 0
}
export default findShortestPath;