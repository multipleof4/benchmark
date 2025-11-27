export async function createStreamVisualizer(asyncIterable, options) {
  const { maxPoints, alpha, width, height, yDomain } = options;
  const d3 = await import('https://cdn.jsdelivr.net/npm/d3@7/+esm');
  
  const data = [];
  let prevEma;

  for await (const { timestamp, value } of asyncIterable) {
    const ema = prevEma === undefined ? value : alpha * value + (1 - alpha) * prevEma;
    prevEma = ema;
    data.push({ timestamp, value, ema });
    if (data.length > maxPoints) data.shift();
  }

  const xScale = d3.scaleLinear()
    .domain([data[0].timestamp, data[data.length - 1].timestamp])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain(yDomain)
    .range([height, 0]);

  const path = d3.line()
    .x(d => xScale(d.timestamp))
    .y(d => yScale(d.ema))
    (data);

  return { data, path };
}
export default createStreamVisualizer;
// Generation time: 4.236s
// Result: PASS