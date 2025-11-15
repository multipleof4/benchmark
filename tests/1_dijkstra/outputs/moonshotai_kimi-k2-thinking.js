async function findShortestPath(graph, start, end) {
  let PriorityQueue;
  try {
    const mod = await import('https://esm.sh/js-priority-queue@1.0.0');
    PriorityQueue = mod.default || mod;
  } catch {
    throw new Error('Failed to load priority queue library');
  }
  
  if (!(start in graph) || !(end in graph)) return Infinity;
  if (start === end) return 0;
  
  const dist = { [start]: 0 };
  const pq = new PriorityQueue({ 
    comparator: (a, b) => a[1] - b[1],
    initialValues: [[start, 0]]
  });
  
  while (pq.length) {
    const [node, d] = pq.dequeue();
    if (node === end) return d;
    if (d > (dist[node] ?? Infinity)) continue;
    
    for (const [neighbor, weight] of Object.entries(graph[node])) {
      const newDist = d + weight;
      if (newDist < (dist[neighbor] ?? Infinity)) {
        dist[neighbor] = newDist;
        pq.queue([neighbor, newDist]);
      }
    }
  }
  
  return Infinity;
}
export default findShortestPath;