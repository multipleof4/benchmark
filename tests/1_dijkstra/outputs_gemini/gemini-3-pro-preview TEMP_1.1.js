const findShortestPath = async (graph, start, end) => {
  const { default: PQ } = await import('https://esm.sh/js-priority-queue')
  const q = new PQ({ comparator: (a, b) => a.w - b.w })
  const dist = { [start]: 0 }
  
  q.queue({ n: start, w: 0 })

  while (q.length) {
    const { n, w } = q.dequeue()
    if (n === end) return w
    if (w > (dist[n] ?? Infinity)) continue

    for (const v in graph[n]) {
      const d = w + graph[n][v]
      if (d < (dist[v] ?? Infinity)) {
        dist[v] = d
        q.queue({ n: v, w: d })
      }
    }
  }
  return Infinity
}
export default findShortestPath;