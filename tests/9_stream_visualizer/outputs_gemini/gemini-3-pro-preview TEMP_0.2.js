export const createStreamVisualizer = async (iter, { maxPoints: M, alpha: A, width: W, height: H, yDomain: Y }) => {
  const { scaleLinear, line } = await import('https://cdn.jsdelivr.net/npm/d3/+esm')
  let D = [], E
  for await (const { timestamp: t, value: v } of iter) {
    E = E == null ? v : A * v + (1 - A) * E
    D.push({ timestamp: t, value: v, ema: E })
    D.length > M && D.shift()
  }
  if (!D.length) return { data: [], path: "" }
  const x = scaleLinear().domain([D[0].timestamp, D.at(-1).timestamp]).range([0, W]),
        y = scaleLinear().domain(Y).range([H, 0])
  return { data: D, path: line().x(d => x(d.timestamp)).y(d => y(d.ema))(D) }
}
export default createStreamVisualizer;