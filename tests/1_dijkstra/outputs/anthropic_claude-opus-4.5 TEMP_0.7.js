async function findShortestPath(graph, start, end) {
  const { default: PriorityQueue } = await import("https://esm.run/js-priority-queue");
  
  const dist = {}, visited = new Set();
  
  for (let n in graph) dist[n] = Infinity;
  dist[start] = 0;
  
  const pq = new PriorityQueue({ comparator: (a, b) => a[1] - b[1] });
  pq.queue([start, 0]);
  
  while (pq.length) {
    const [node, d] = pq.dequeue();
    
    if (visited.has(node)) continue;
    visited.add(node);
    
    if (node === end) return d;
    
    for (let neighbor in graph[node] || {}) {
      if (visited.has(neighbor)) continue;
      const newDist = d + graph[node][neighbor];
      if (newDist < dist[neighbor]) {
        dist[neighbor] = newDist;
        pq.queue([neighbor, newDist]);
      }
    }
  }
  
  return dist[end] ?? Infinity;
}
export default findShortestPath;