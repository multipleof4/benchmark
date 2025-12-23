async function findShortestPath(graph, start, end) {
    const { default: PriorityQueue } = await import('https://esm.sh/js-priority-queue@1.0.0');
    const pq = new PriorityQueue({ comparator: (a, b) => a[1] - b[1] });
    const costs = { [start]: 0 };
    pq.queue([start, 0]);

    while (pq.length) {
        const [node, currentCost] = pq.dequeue();

        if (node === end) return currentCost;
        if (currentCost > costs[node]) continue;

        const neighbors = graph[node] || {};
        for (const [neighbor, weight] of Object.entries(neighbors)) {
            const newCost = currentCost + weight;
            if (newCost < (costs[neighbor] ?? Infinity)) {
                costs[neighbor] = newCost;
                pq.queue([neighbor, newCost]);
            }
        }
    }

    return Infinity;
}
export default findShortestPath;
// Generation time: 42.134s
// Result: FAIL