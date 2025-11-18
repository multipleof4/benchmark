export const createStreamVisualizer = async (feed, { maxPoints, alpha, width, height, yDomain }) => {
  const { scaleLinear, line } = await import('https://cdn.jsdelivr.net/npm/d3@7/+esm')
  const data = []
  let prev = null

  for await (const { timestamp, value } of feed) {
    const ema = prev === null ? value : alpha * value + (1 - alpha) * prev
    prev = ema
    data.push({ timestamp, value, ema })
    if (data.length > maxPoints) data.shift()
  }

  if (!data.length) return { data, path: '' }

  const x = scaleLinear()
    .domain([data[0].timestamp, data.at(-1).timestamp])
    .range([0, width])

  const y = scaleLinear()
    .domain(yDomain)
    .range([height, 0])

  const gen = line()
    .x(d => x(d.timestamp))
    .y(d => y(d.ema))

  return { data, path: gen(data) }
}
export default createStreamVisualizer;