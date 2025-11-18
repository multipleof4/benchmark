const findShortestPath = async (graph, start, end) => {
  const { default: PriorityQueue } = await import('https://cdn.jsdelivr.net/npm/js-priority-queue@0.1.5/+esm')
  const dists = new Map([[start, 0]])
  const pq = new PriorityQueue({ comparator: (a, b) => a.w - b.w })

  pq.queue({ n: start, w: 0 })

  while (pq.length) {
    const { n, w } = pq.dequeue()
    
    if (n === end) return w
    if (w > (dists.get(n) ?? 1 / 0)) continue

    for (const [neighbor, weight] of Object.entries(graph[n] || {})) {
      const newWeight = w + weight
      if (newWeight < (dists.get(neighbor) ?? 1 / 0)) {
        dists.set(neighbor, newWeight)
        pq.queue({ n: neighbor, w: newWeight })
      }
    }
  }

  return 1 / 0
}
export default findShortestPath;