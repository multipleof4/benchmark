async function createStreamVisualizer(iterable, {
  maxPoints = 100,
  alpha = .5,
  width = 300,
  height = 150,
  yDomain = [0, 1]
} = {}) {
  const { scaleLinear, line } = await import('https://cdn.jsdelivr.net/npm/d3@7/+esm')
  const data = []
  let ema
  for await (const point of iterable) {
    const { timestamp, value } = point
    ema = ema == null ? value : alpha * value + (1 - alpha) * ema
    data.push({ timestamp, value, ema })
    data.length > maxPoints && data.shift()
  }
  if (!data.length) return { data, path: '' }
  const x = scaleLinear().domain([data[0].timestamp, data.at(-1).timestamp]).range([0, width])
  const y = scaleLinear().domain(yDomain).range([height, 0])
  const path = line().x(d => x(d.timestamp)).y(d => y(d.ema))(data) || ''
  return { data, path }
}
export default createStreamVisualizer;