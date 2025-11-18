export const createStreamVisualizer = async (stream, { maxPoints, alpha, width, height, yDomain }) => {
  const { scaleLinear, line } = await import('https://cdn.jsdelivr.net/npm/d3@7/+esm')
  let data = [], ema
  for await (const { timestamp: t, value: v } of stream) {
    ema = ema === undefined ? v : alpha * v + (1 - alpha) * ema
    data.push({ timestamp: t, value: v, ema })
    if (data.length > maxPoints) data.shift()
  }
  if (!data.length) return { data, path: '' }
  const x = scaleLinear().domain([data[0].timestamp, data.at(-1).timestamp]).range([0, width])
  const y = scaleLinear().domain(yDomain).range([height, 0])
  return { data, path: line().x(d => x(d.timestamp)).y(d => y(d.ema))(data) }
}
export default createStreamVisualizer;