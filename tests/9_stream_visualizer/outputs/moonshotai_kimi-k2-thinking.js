async function createStreamVisualizer(asyncIterable, { maxPoints, alpha, width, height, yDomain }) {
  const d3 = await import('d3'), data = [];
  let pe;
  
  for await (const { timestamp: t, value: v } of asyncIterable) {
    const ema = pe === undefined ? v : alpha * v + (1 - alpha) * pe;
    pe = ema;
    data.push({ timestamp: t, value: v, ema });
    data.length > maxPoints && data.shift();
  }
  
  if (!data.length) return { data: [], path: '' };
  
  const x = d3.scaleLinear().domain([data[0].timestamp, data.at(-1).timestamp]).range([0, width]);
  const y = d3.scaleLinear().domain(yDomain).range([height, 0]);
  
  return { data, path: d3.line().x(d => x(d.timestamp)).y(d => y(d.ema))(data) };
}
export default createStreamVisualizer;
// Generation time: 81.116s
// Result: FAIL