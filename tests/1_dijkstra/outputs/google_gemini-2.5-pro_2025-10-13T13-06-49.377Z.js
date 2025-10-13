/**
 * Finds the shortest path in a weighted, undirected graph using Dijkstra's algorithm.
 * This function dynamically imports a Priority Queue library from a CDN.
 *
 * @param {object} graph - The graph structure, e.g., { 'A': { 'B': 1, 'C': 4 }, 'B': { ... } }.
 * @param {string} startNode - The starting node for the path.
 * @param {string} endNode - The destination node for the path.
 * @returns {Promise<number>} A promise that resolves to the total weight of the shortest path, or Infinity if no path exists.
 */
async function findShortestPath(graph, startNode, endNode) {
  // 1. Dynamically import the priority queue library from a CDN.
  //    The 'js-priority-queue' library is a UMD module, so the main export
  //    is often on the 'default' property when imported this way.
  let PriorityQueue;
  try {
    const PriorityQueueModule = await import('https://cdn.jsdelivr.net/npm/js-priority-queue@0.1.5/priority-queue.min.js');
    PriorityQueue = PriorityQueueModule.default;
  } catch (error) {
    console.error("Failed to load the Priority Queue library:", error);
    // Cannot proceed without the library, so we throw an error.
    throw new Error("Could not load a required dependency.");
  }


  // 2. Initialize data structures for Dijkstra's algorithm.
  const distances = {}; // Stores the shortest known distance from the startNode to every other node.
  const previous = {};  // Stores the preceding node in the shortest path.
  
  // A min-priority queue to store nodes to visit, prioritized by distance.
  const pq = new PriorityQueue({ comparator: (a, b) => a.priority - b.priority });

  // 3. Set initial state.
  Object.keys(graph).forEach(node => {
    if (node === startNode) {
      distances[node] = 0;
      pq.queue({ value: node, priority: 0 }); // Add the start node to the queue with priority 0.
    } else {
      distances[node] = Infinity;
    }
    previous[node] = null;
  });

  // 4. Main loop of the algorithm.
  while (pq.length > 0) {
    // Get the node with the smallest distance from the queue.
    const { value: currentNode } = pq.dequeue();

    // If we've reached the end node, we have found the shortest path.
    if (currentNode === endNode) {
      // If a path exists, the distance will be a finite number.
      if (distances[endNode] !== Infinity) {
        return distances[endNode];
      }
      // This break is for the case where endNode is unreachable but was queued
      // with an infinite priority (which shouldn't happen with this logic, but is safe).
      break;
    }

    // Explore neighbors of the current node.
    if (graph[currentNode]) {
      for (const neighbor in graph[currentNode]) {
        const weight = graph[currentNode][neighbor];
        const newPathWeight = distances[currentNode] + weight;

        // If we've found a shorter path to this neighbor...
        if (newPathWeight < distances[neighbor]) {
          // ...update its distance, record the path, and add it to the queue.
          distances[neighbor] = newPathWeight;
          previous[neighbor] = currentNode;
          pq.queue({ value: neighbor, priority: newPathWeight });
        }
      }
    }
  }

  // 5. If the loop finishes and we haven't returned, the endNode was not reachable.
  return Infinity;
}


// --- Example Usage ---

// Define our weighted, undirected graph.
const graph = {
  'A': { 'B': 1, 'C': 4 },
  'B': { 'A': 1, 'C': 2, 'D': 5 },
  'C': { 'A': 4, 'B': 2, 'E': 3 },
  'D': { 'B': 5, 'E': 1 },
  'E': { 'C': 3, 'D': 1 },
  'F': { 'G': 1 }, // An unconnected component
  'G': { 'F': 1 }
};

// We use an async IIFE (Immediately Invoked Function Expression) to run our async function.
(async () => {
    try {
        console.log("Finding shortest path from A to E...");
        const pathWeight1 = await findShortestPath(graph, 'A', 'E');
        // Expected Path: A -> B -> C -> E, Weight: 1 + 2 + 3 = 6
        console.log(`Shortest path weight from A to E is: ${pathWeight1}`); // Output: 6

        console.log("\nFinding shortest path from A to D...");
        const pathWeight2 = await findShortestPath(graph, 'A', 'D');
        // Expected Path: A -> B -> D, Weight: 1 + 5 = 6
        console.log(`Shortest path weight from A to D is: ${pathWeight2}`); // Output: 6

        console.log("\nFinding shortest path from A to A...");
        const pathWeight3 = await findShortestPath(graph, 'A', 'A');
        console.log(`Shortest path weight from A to A is: ${pathWeight3}`); // Output: 0

        console.log("\nFinding shortest path from A to F (unreachable)...");
        const pathWeight4 = await findShortestPath(graph, 'A', 'F');
        console.log(`Shortest path weight from A to F is: ${pathWeight4}`); // Output: Infinity
    } catch(err) {
        console.error("An error occurred during pathfinding:", err);
    }
})();