export async function createStreamVisualizer(asyncIterable, { maxPoints, alpha, width, height, yDomain }) {
  const d3 = await import("https://cdn.skypack.dev/d3@7");
  let data = [];
  let ema = null;

  for await (const { timestamp, value } of asyncIterable) {
    ema = (ema === null) ? value : alpha * value + (1 - alpha) * ema;
    data.push({ timestamp, value, ema });
    if (data.length > maxPoints) data.shift();
  }

  if (!data.length) return { data: [], path: "" };

  const x = d3.scaleLinear()
    .domain([data[0].timestamp, data.at(-1).timestamp])
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain(yDomain)
    .range([height, 0]);

  const lineGenerator = d3.line()
    .x(d => x(d.timestamp))
    .y(d => y(d.ema));

  return {
    data,
    path: lineGenerator(data)
  };
}
export default createStreamVisualizer;
// Generation time: 11.081s
// Result: PASS