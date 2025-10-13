/**
 * Finds the shortest path in a weighted, undirected graph using Dijkstra's algorithm.
 * 
 * This function dynamically imports the 'js-priority-queue' library to manage nodes to visit.
 *
 * @param {object} graph - The graph structure. e.g., { 'A': { 'B': 1, 'C': 4 }, 'B': { ... }, ... }
 * @param {string} startNode - The starting node.
 * @param {string} endNode - The ending node.
 * @returns {Promise<number>} The total weight of the shortest path, or Infinity if no path exists.
 */
async function findShortestPath(graph, startNode, endNode) {
    let PriorityQueue;
    try {
        // Dynamically import the PriorityQueue library from a CDN.
        // The { default: ... } syntax is used to get the default export from the UMD module.
        const PQLib = await import('https://cdn.jsdelivr.net/npm/js-priority-queue@0.1.5/priority-queue.min.js');
        PriorityQueue = PQLib.default;
    } catch (e) {
        console.error("Failed to load the Priority Queue library from the CDN.", e);
        // Can't proceed without the library.
        throw new Error("Could not load a required dependency.");
    }

    // 1. Initialize distances, priority queue, and previous nodes map
    const distances = {};
    const priorityQueue = new PriorityQueue({
        // The comparator ensures the queue is a min-priority queue based on distance.
        comparator: (a, b) => a.distance - b.distance
    });

    // Set initial distances for all nodes
    for (const node in graph) {
        if (node === startNode) {
            distances[node] = 0;
            priorityQueue.queue({ node: node, distance: 0 });
        } else {
            distances[node] = Infinity;
        }
    }
    
    // If the start or end node is not in the graph, no path can exist.
    if (distances[startNode] === undefined || distances[endNode] === undefined) {
      return Infinity;
    }


    // 2. Main loop of Dijkstra's algorithm
    while (priorityQueue.length > 0) {
        // Get the node with the smallest distance from the queue
        const { node: currentNode, distance: currentDistance } = priorityQueue.dequeue();

        // If we've already found a shorter path to the current node, skip it.
        if (currentDistance > distances[currentNode]) {
            continue;
        }

        // If we've reached the end node, we have found the shortest path.
        if (currentNode === endNode) {
            // The value in 'distances' is the shortest path weight.
            return distances[endNode];
        }

        const neighbors = graph[currentNode];
        if (!neighbors) continue; // Skip if node has no outgoing edges

        // 3. Relaxation step: Check all neighbors of the current node
        for (const neighbor in neighbors) {
            const weight = neighbors[neighbor];
            const distanceThroughCurrent = currentDistance + weight;

            // If we found a shorter path to the neighbor, update it.
            if (distanceThroughCurrent < distances[neighbor]) {
                distances[neighbor] = distanceThroughCurrent;
                // Enqueue the neighbor with its new, shorter distance.
                priorityQueue.queue({ node: neighbor, distance: distanceThroughCurrent });
            }
        }
    }

    // 4. If the loop finishes and we haven't returned, the end node is unreachable.
    return distances[endNode]; // This will be Infinity
}


// --- Example Usage ---

// Define the graph structure
const graph = {
    'A': { 'B': 2, 'C': 5 },
    'B': { 'A': 2, 'C': 6, 'D': 1 },
    'C': { 'A': 5, 'B': 6, 'D': 6, 'E': 8 },
    'D': { 'B': 1, 'C': 6, 'E': 2 },
    'E': { 'C': 8, 'D': 2 },
    'F': { 'G': 1 }, // A disconnected part of the graph
    'G': { 'F': 1 }
};

// We wrap the calls in an async IIFE (Immediately Invoked Function Expression)
// because we can only use 'await' inside an async function.
(async () => {
    console.log("Finding shortest path from A to E...");
    const pathAtoE = await findShortestPath(graph, 'A', 'E');
    console.log(`Shortest path from A to E has a weight of: ${pathAtoE}`); // Expected: 5 (A -> B -> D -> E)

    console.log("\nFinding shortest path from A to C...");
    const pathAtoC = await findShortestPath(graph, 'A', 'C');
    console.log(`Shortest path from A to C has a weight of: ${pathAtoC}`); // Expected: 5 (A -> C)

    console.log("\nFinding shortest path from A to A...");
    const pathAtoA = await findShortestPath(graph, 'A', 'A');
    console.log(`Shortest path from A to A has a weight of: ${pathAtoA}`); // Expected: 0

    console.log("\nFinding shortest path from A to F (unreachable)...");
    const pathAtoF = await findShortestPath(graph, 'A', 'F');
    console.log(`Shortest path from A to F has a weight of: ${pathAtoF}`); // Expected: Infinity

    console.log("\nFinding shortest path from A to Z (non-existent node)...");
    const pathAtoZ = await findShortestPath(graph, 'A', 'Z');
    console.log(`Shortest path from A to Z has a weight of: ${pathAtoZ}`); // Expected: Infinity
})();