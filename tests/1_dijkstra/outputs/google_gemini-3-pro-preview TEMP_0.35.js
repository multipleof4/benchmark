const findShortestPath = async (g, s, e) => {
  const { default: Q } = await import('https://esm.sh/js-priority-queue')
  const q = new Q({ comparator: (a, b) => a.w - b.w })
  const d = { [s]: 0 }
  q.queue({ n: s, w: 0 })

  while (q.length) {
    const { n, w } = q.dequeue()
    if (n === e) return w
    if (w > (d[n] ?? Infinity)) continue

    for (const v in g[n]) {
      const k = w + g[n][v]
      if (k < (d[v] ?? Infinity)) {
        d[v] = k
        q.queue({ n: v, w: k })
      }
    }
  }
  return Infinity
}
export default findShortestPath;