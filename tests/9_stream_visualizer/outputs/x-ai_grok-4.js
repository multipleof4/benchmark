async function createStreamVisualizer(asyncIterable, options) {
  const { maxPoints, alpha, width, height, yDomain } = options;
  const d3 = await import('d3');
  const data = [];
  let prevEma = null;
  let first = true;
  for await (const { timestamp, value } of asyncIterable) {
    let ema;
    if (first) {
      ema = value;
      prevEma = value;
      first = false;
    } else {
      ema = alpha * value + (1 - alpha) * prevEma;
      prevEma = ema;
    }
    data.push({ timestamp, value, ema });
    if (data.length > maxPoints) data.shift();
  }
  if (data.length === 0) return { data, path: '' };
  const x = d3.scaleLinear()
    .domain([data[0].timestamp, data[data.length - 1].timestamp])
    .range([0, width]);
  const y = d3.scaleLinear()
    .domain(yDomain)
    .range([height, 0]);
  const line = d3.line()
    .x(d => x(d.timestamp))
    .y(d => y(d.ema));
  const path = line(data);
  return { data, path };
}
export default createStreamVisualizer;
// Generation time: 34.223s
// Result: FAIL