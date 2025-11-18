const createStreamVisualizer = async (feed, { maxPoints: M, alpha: A, width: W, height: H, yDomain: Y }) => {
  const { scaleLinear: S, line: L } = await import('https://cdn.jsdelivr.net/npm/d3@7/+esm')
  const data = []; let ema

  for await (const { timestamp: t, value: v } of feed) {
    ema = ema == null ? v : A * v + (1 - A) * ema
    data.push({ timestamp: t, value: v, ema })
    if (data.length > M) data.shift()
  }

  if (!data.length) return { data, path: '' }

  const x = S().domain([data[0].timestamp, data.at(-1).timestamp]).range([0, W])
  const y = S().domain(Y).range([H, 0])
  
  return {
    data,
    path: L().x(d => x(d.timestamp)).y(d => y(d.ema))(data)
  }
}
export default createStreamVisualizer;