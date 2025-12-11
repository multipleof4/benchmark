export async function findShortestPath(graph, start, end) {
  if (start === end) return 0
  if (!graph || typeof graph !== "object") return Infinity

  const { default: PriorityQueue } = await import(
    "https://cdn.jsdelivr.net/npm/js-priority-queue@0.1.5/+esm"
  )

  const dist = Object.create(null)
  dist[start] = 0

  const pq = new PriorityQueue({ comparator: (a, b) => a[0] - b[0] })
  pq.queue([0, start])

  while (pq.length) {
    const [d, u] = pq.dequeue()
    if (d !== dist[u]) continue
    if (u === end) return d

    const nbrs = graph[u]
    if (!nbrs || typeof nbrs !== "object") continue

    for (const v in nbrs) {
      const w = +nbrs[v]
      if (!Number.isFinite(w) || w < 0) continue
      const nd = d + w
      const cur = dist[v]
      if (cur === undefined || nd < cur) {
        dist[v] = nd
        pq.queue([nd, v])
      }
    }
  }

  return Infinity
}
export default findShortestPath;
// Generation time: 6.889s
// Result: PASS