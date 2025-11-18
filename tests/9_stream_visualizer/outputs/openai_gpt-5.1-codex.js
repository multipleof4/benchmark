const createStreamVisualizer = async (src, opt = {}) => {
  const { maxPoints = 100, alpha = 0.5, width = 600, height = 300, yDomain = [0, 1] } = opt
  const { scaleLinear, line } = await import('https://cdn.jsdelivr.net/npm/d3@7/+esm')
  const data = []
  let ema
  for await (const p of src) {
    if (!p) continue
    const { timestamp: t, value: v } = p
    if (t == null || v == null) continue
    ema = ema == null ? v : alpha * v + (1 - alpha) * ema
    data.push({ timestamp: t, value: v, ema })
    data.length > maxPoints && data.shift()
  }
  if (!data.length) return { data, path: '' }
  const x = scaleLinear().domain([data[0].timestamp, data.at(-1).timestamp]).range([0, width])
  const y = scaleLinear().domain(yDomain).range([height, 0])
  const path = line().x(d => x(d.timestamp)).y(d => y(d.ema))(data) || ''
  return { data, path }
}
export default createStreamVisualizer;