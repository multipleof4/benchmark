async function createStreamVisualizer(asyncIterable, options) {
  const { maxPoints, alpha, width, height, yDomain } = options;
  const d3 = await import("https://cdn.jsdelivr.net/npm/d3@7/+esm");
  
  const data = [];
  let ema = null;
  
  for await (const { timestamp, value } of asyncIterable) {
    ema = ema === null ? value : alpha * value + (1 - alpha) * ema;
    data.push({ timestamp, value, ema });
    data.length > maxPoints && data.shift();
  }
  
  const xScale = d3.scaleLinear()
    .domain([data[0].timestamp, data[data.length - 1].timestamp])
    .range([0, width]);
  
  const yScale = d3.scaleLinear()
    .domain(yDomain)
    .range([height, 0]);
  
  const path = d3.line()
    .x(d => xScale(d.timestamp))
    .y(d => yScale(d.ema))(data);
  
  return { data, path };
}
export default createStreamVisualizer;
// Generation time: 5.230s
// Result: PASS