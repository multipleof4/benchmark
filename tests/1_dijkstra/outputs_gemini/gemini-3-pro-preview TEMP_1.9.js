const findShortestPath = async (graph, start, end) => {
  const { default: PQ } = await import('https://esm.sh/js-priority-queue@0.1.5')
  const q = new PQ({ compare: (a, b) => a.d - b.d })
  const dist = { [start]: 0 }

  q.queue({ n: start, d: 0 })

  while (q.length) {
    const { n, d } = q.dequeue()

    if (n === end) return d
    if (d > (dist[n] ?? Infinity)) continue

    for (const [v, w] of Object.entries(graph[n] || {})) {
      const t = d + w
      if (t < (dist[v] ?? Infinity)) {
        dist[v] = t
        q.queue({ n: v, d: t })
      }
    }
  }

  return Infinity
}
export default findShortestPath;