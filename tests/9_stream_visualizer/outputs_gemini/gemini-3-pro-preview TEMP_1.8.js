export const createStreamVisualizer = async (
  stream,
  { maxPoints, alpha, width, height, yDomain }
) => {
  const { scaleLinear, line } = await import('https://esm.sh/d3@7')
  const data = []
  let prev

  for await (const { timestamp, value } of stream) {
    const ema = prev == null ? value : alpha * value + (1 - alpha) * prev
    prev = ema
    if (data.push({ timestamp, value, ema }) > maxPoints) data.shift()
  }

  if (!data.length) return { data, path: '' }

  const xScale = scaleLinear()
    .domain([data[0].timestamp, data.at(-1).timestamp])
    .range([0, width])

  const yScale = scaleLinear()
    .domain(yDomain)
    .range([height, 0])

  const generator = line()
    .x(d => xScale(d.timestamp))
    .y(d => yScale(d.ema))

  return { data, path: generator(data) }
}
export default createStreamVisualizer;