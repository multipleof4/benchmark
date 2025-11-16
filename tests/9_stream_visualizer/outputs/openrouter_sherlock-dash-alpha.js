async function createStreamVisualizer(asyncIterable, { maxPoints = 100, alpha = 0.3, width = 800, height = 400, yDomain = [-1, 1] } = {}) {
  const { select, scaleLinear, scaleTime, line } = await import('https://cdn.skypack.dev/d3@7');
  
  let data = [], prevEma;
  
  for await (const { timestamp, value } of asyncIterable) {
    const ema = prevEma === undefined ? value : alpha * value + (1 - alpha) * prevEma;
    prevEma = ema;
    
    data.push({ timestamp, value, ema });
    if (data.length > maxPoints) data.shift();
  }
  
  if (!data.length) return { data: [], path: '' };
  
  const x = scaleLinear().domain([data[0].timestamp, data[data.length - 1].timestamp]).range([0, width]);
  const y = scaleLinear().domain(yDomain).range([height, 0]);
  
  const lineGen = line()
    .x(d => x(d.timestamp))
    .y(d => y(d.ema))
    .curve(select.curveMonotoneX);
  
  return { data, path: lineGen(data) };
}
export default createStreamVisualizer;