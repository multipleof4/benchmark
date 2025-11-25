const findShortestPath = async (graph, start, end) => {
  const { default: PriorityQueue } = await import('https://cdn.jsdelivr.net/npm/js-priority-queue@1.0.0/+esm')

  if (!graph[start] || !graph[end]) return Infinity

  const distances = Object.keys(graph).reduce((acc, node) => {
    acc[node] = node === start ? 0 : Infinity
    return acc
  }, {})

  const pq = new PriorityQueue({ comparator: (a, b) => a.distance - b.distance })
  pq.queue({ node: start, distance: 0 })

  const visited = new Set()

  while (pq.length) {
    const { node, distance } = pq.dequeue()

    if (node === end) return distance
    if (visited.has(node)) continue

    visited.add(node)

    Object.entries(graph[node]).forEach(([neighbor, weight]) => {
      if (visited.has(neighbor)) return

      const newDistance = distance + weight
      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance
        pq.queue({ node: neighbor, distance: newDistance })
      }
    })
  }

  return Infinity
}
export default findShortestPath;