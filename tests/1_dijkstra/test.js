export default {
  functionName: 'findShortestPath',
  prompt: `// Write an async JavaScript function 'findShortestPath' that finds the shortest path in a weighted, undirected graph using Dijkstra's algorithm.
// - The function must accept a graph, a start node, and an end node.
// - You MUST use a dynamic import() to load the 'js-priority-queue' library from a CDN for the priority queue.
// - The function should return the total weight of the shortest path, or Infinity if no path exists.
// - Graph format: { 'A': { 'B': 1, 'C': 4 }, 'B': { ... }, ... }`,
  getTestCases: () => {
    const graph = {
      A: { B: 2, C: 5 }, B: { A: 2, C: 6, D: 1, E: 3 }, C: { A: 5, B: 6, F: 8 },
      D: { B: 1, E: 4 }, E: { B: 3, D: 4, F: 2 }, F: { C: 8, E: 2 }
    };
    return [graph, 'A', 'F'];
  },
  runTest: async (findShortestPath) => {
    const assert = {
      strictEqual: (a, e, m) => { if (a !== e) throw new Error(m || `FAIL: ${a} !== ${e}`) },
    };
    const [graph, start, end] = globalThis.getTestCases ? globalThis.getTestCases() : this.getTestCases();
    const dist = await findShortestPath(graph, start, end);
    assert.strictEqual(dist, 7, "Test Failed: Path A to F should be 7.");
  }
};
