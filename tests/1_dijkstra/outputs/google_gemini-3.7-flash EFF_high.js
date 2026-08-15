async function findShortestPath(graph, start, end) {
  const { default: PriorityQueue } = await import('https://esm.sh/js-priority-queue');
  const dist = { [start]: 0 };
  const pq = new PriorityQueue({ comparator: (a, b) => a.cost - b.cost });

  pq.queue({ node: start, cost: 0 });

  while (pq.length) {
    const { node, cost } = pq.dequeue();

    if (node === end) return cost;
    if (cost > dist[node]) continue;

    for (const [adj, weight] of Object.entries(graph[node] ?? {})) {
      const total = cost + weight;
      if (total < (dist[adj] ?? Infinity)) {
        dist[adj] = total;
        pq.queue({ node: adj, cost: total });
      }
    }
  }

  return Infinity;
}
export default findShortestPath;
// Generation time: 10.601s
// Result: PASS