export async function createStreamVisualizer(iter, o) {
  const { maxPoints, alpha, width, height, yDomain } = o
  const d3 = await import('https://cdn.jsdelivr.net/npm/d3@7/+esm')
  const data = []
  let ema
  for await (const { timestamp, value } of iter) {
    ema = ema == null ? value : alpha * value + (1 - alpha) * ema
    data.push({ timestamp, value, ema })
    if (data.length > maxPoints) data.shift()
  }
  const xs = d3.scaleLinear()
    .domain([data[0].timestamp, data[data.length - 1].timestamp])
    .range([0, width])
  const ys = d3.scaleLinear()
    .domain(yDomain)
    .range([height, 0])
  const line = d3.line()
    .x(d => xs(d.timestamp))
    .y(d => ys(d.ema))
  const path = line(data) || ''
  return { data, path }
}
export default createStreamVisualizer;