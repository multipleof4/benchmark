export async function findShortestPath(graph, start, end) {
    const { PriorityQueue } = await import("https://cdn.jsdelivr.net/npm/js-priority-queue@0.1.15/+esm");
    
    const distances = {};
    const visited = new Set();
    const queue = new PriorityQueue({ comparator: (a, b) => a.distance - b.distance });
    
    for (const node in graph) {
        distances[node] = Infinity;
    }
    distances[start] = 0;
    queue.enqueue({ node: start, distance: 0 });
    
    while (queue.length > 0) {
        const { node: current, distance } = queue.dequeue();
        
        if (current === end) return distance;
        if (visited.has(current)) continue;
        visited.add(current);
        
        for (const [neighbor, weight] of Object.entries(graph[current] || {})) {
            const newDistance = distance + weight;
            if (newDistance < distances[neighbor]) {
                distances[neighbor] = newDistance;
                queue.enqueue({ node: neighbor, distance: newDistance });
            }
        }
    }
    
    return Infinity;
}
export default findShortestPath;
// Generation time: 4.700s
// Result: FAIL