async function findShortestPath(graph, start, end) {
  const PQ = (await import('https://unpkg.com/js-priority-queue@0.1.5')).default;
  const D = {};
  D[start] = 0;
  const q = new PQ({comparator: (a, b) => a.d - b.d});
  q.queue({n: start, d: 0});
  while (q.length) {
    let {n: u, d} = q.dequeue();
    if (d > D[u]) continue;
    for (let v in graph[u]) {
      let a = d + graph[u][v];
      if (a < (D[v] ?? Infinity)) {
        D[v] = a;
        q.queue({n: v, d: a});
      }
    }
  }
  return D[end] ?? Infinity;
}
export default findShortestPath;
// Generation time: 82.003s
// Result: FAIL