const createStreamVisualizer = async (iter, { maxPoints: M, alpha: A, width: W, height: H, yDomain: Y }) => {
  const { scaleLinear, line } = await import('https://cdn.jsdelivr.net/npm/d3@7/+esm')
  const D = []
  let E

  for await (const { timestamp: t, value: v } of iter) {
    E = E === undefined ? v : A * v + (1 - A) * E
    D.push({ timestamp: t, value: v, ema: E })
    if (D.length > M) D.shift()
  }

  if (!D.length) return { data: D, path: '' }

  const x = scaleLinear().domain([D[0].timestamp, D.at(-1).timestamp]).range([0, W])
  const y = scaleLinear().domain(Y).range([H, 0])
  const l = line().x(d => x(d.timestamp)).y(d => y(d.ema))

  return { data: D, path: l(D) }
}
export default createStreamVisualizer;