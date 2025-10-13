async function findShortestPath(graph, start, end) {
  // Dynamically import the priority queue library from CDN
  const { default: PriorityQueue } = await import(
    'https://cdn.jsdelivr.net/npm/js-priority-queue@0.1.5/+esm'
  );

  // Initialize distances map - all nodes start at Infinity except start node
  const distances = {};
  for (let node in graph) {
    distances[node] = Infinity;
  }
  distances[start] = 0;

  // Create a min-heap priority queue (lower distance = higher priority)
  const pq = new PriorityQueue({
    comparator: (a, b) => a.distance - b.distance
  });

  // Track visited nodes to avoid reprocessing
  const visited = new Set();

  // Start with the initial node
  pq.queue({ node: start, distance: 0 });

  while (pq.length > 0) {
    const { node: currentNode, distance: currentDistance } = pq.dequeue();

    // Skip if already visited
    if (visited.has(currentNode)) {
      continue;
    }

    // Mark as visited
    visited.add(currentNode);

    // If we reached the end node, return the distance
    if (currentNode === end) {
      return currentDistance;
    }

    // Check if current node exists in graph
    if (!graph[currentNode]) {
      continue;
    }

    // Explore neighbors
    for (let neighbor in graph[currentNode]) {
      if (!visited.has(neighbor)) {
        const weight = graph[currentNode][neighbor];
        const newDistance = currentDistance + weight;

        // If we found a shorter path, update it
        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
          pq.queue({ node: neighbor, distance: newDistance });
        }
      }
    }
  }

  // If we get here, no path exists to the end node
  return Infinity;
}

// Example usage:
const graph = {
  'A': { 'B': 1, 'C': 4 },
  'B': { 'A': 1, 'C': 2, 'D': 5 },
  'C': { 'A': 4, 'B': 2, 'D': 1 },
  'D': { 'B': 5, 'C': 1 }
};

findShortestPath(graph, 'A', 'D').then(distance => {
  console.log(`Shortest path from A to D: ${distance}`); // Output: 4 (A -> B -> C -> D)
});

// Example with no path
const disconnectedGraph = {
  'A': { 'B': 1 },
  'B': { 'A': 1 },
  'C': { 'D': 1 },
  'D': { 'C': 1 }
};

findShortestPath(disconnectedGraph, 'A', 'D').then(distance => {
  console.log(`Shortest path from A to D: ${distance}`); // Output: Infinity
});