const findShortestPath = async (g, s, e) => {
  const { default: Q } = await import('https://esm.sh/js-priority-queue')
  const q = new Q({ comparator: (a, b) => a.w - b.w })
  const d = { [s]: 0 }
  q.queue({ n: s, w: 0 })

  while (q.length) {
    const { n, w } = q.dequeue()
    if (n === e) return w
    if (w > (d[n] ?? 1/0)) continue

    for (let v in g[n]) {
      let t = w + g[n][v]
      if (t < (d[v] ?? 1/0)) {
        d[v] = t
        q.queue({ n: v, w: t })
      }
    }
  }
  return 1/0
}
export default findShortestPath;