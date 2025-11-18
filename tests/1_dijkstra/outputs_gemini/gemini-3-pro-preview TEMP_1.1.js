const findShortestPath = async (graph, start, end) => {
  const { default: PQ } = await import('https://cdn.jsdelivr.net/npm/js-priority-queue/+esm')
  const costs = { [start]: 0 }
  const queue = new PQ({ comparator: (a, b) => a.cost - b.cost })

  queue.queue({ node: start, cost: 0 })

  while (queue.length) {
    const { node, cost } = queue.dequeue()

    if (node === end) return cost
    if (cost > (costs[node] ?? Infinity)) continue

    for (const [neighbor, weight] of Object.entries(graph[node] || {})) {
      const nextCost = cost + weight
      if (nextCost < (costs[neighbor] ?? Infinity)) {
        costs[neighbor] = nextCost
        queue.queue({ node: neighbor, cost: nextCost })
      }
    }
  }

  return Infinity
}
export default findShortestPath;