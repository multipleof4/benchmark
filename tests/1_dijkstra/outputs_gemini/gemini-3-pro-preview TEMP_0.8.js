const findShortestPath = async (g, s, e) => {
  const { default: P } = await import('https://esm.sh/js-priority-queue')
  const q = new P({ comparator: (a, b) => a.w - b.w })
  const d = { [s]: 0 }
  q.queue({ n: s, w: 0 })

  while (q.length) {
    const { n, w } = q.dequeue()
    if (n === e) return w
    if (w > (d[n] ?? Infinity)) continue

    for (const k in g[n]) {
      const c = w + g[n][k]
      if (c < (d[k] ?? Infinity)) {
        d[k] = c
        q.queue({ n: k, w: c })
      }
    }
  }
  return Infinity
}
export default findShortestPath;