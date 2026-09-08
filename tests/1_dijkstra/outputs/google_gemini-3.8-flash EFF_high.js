export async function findShortestPath(graph, start, end) {
  const { default: PriorityQueue } = await import('https://esm.sh/js-priority-queue');

  const dist = new Map([[start, 0]]);
  const pq = new PriorityQueue({ comparator: (a, b) => a[1] - b[1] });
  pq.queue([start, 0]);

  while (pq.length) {
    const [node, cost] = pq.dequeue();

    if (node === end) return cost;
    if (cost > (dist.get(node) ?? Infinity)) continue;

    for (const [neighbor, weight] of Object.entries(graph[node] ?? {})) {
      const nextCost = cost + weight;
      if (nextCost < (dist.get(neighbor) ?? Infinity)) {
        dist.set(neighbor, nextCost);
        pq.queue([neighbor, nextCost]);
      }
    }
  }

  return Infinity;
}
export default findShortestPath;
// Generation time: 16.431s
// Result: PASS