export const createStreamVisualizer = async (
  source, 
  { maxPoints: max, alpha, width, height, yDomain }
) => {
  const { scaleTime, scaleLinear, line } = await import('https://cdn.jsdelivr.net/npm/d3@7/+esm');
  
  let data = [], prev;

  for await (const { timestamp: t, value: v } of source) {
    const ema = prev === undefined ? v : alpha * v + (1 - alpha) * prev;
    prev = ema;
    data.push({ timestamp: t, value: v, ema });
    if (data.length > max) data.shift();
  }

  if (!data.length) return { data, path: "" };

  const x = scaleTime()
    .domain([data[0].timestamp, data.at(-1).timestamp])
    .range([0, width]);

  const y = scaleLinear()
    .domain(yDomain)
    .range([height, 0]);

  const pathGen = line()
    .x(d => x(d.timestamp))
    .y(d => y(d.ema));

  return { data, path: pathGen(data) };
};
export default createStreamVisualizer;