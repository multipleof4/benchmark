export const createStreamVisualizer = async (
  stream,
  { maxPoints, alpha, width, height, yDomain }
) => {
  const { scaleLinear, line } = await import('https://cdn.jsdelivr.net/npm/d3@7/+esm');
  const data = [];
  let prev = null;

  for await (const { timestamp, value } of stream) {
    const ema = prev == null ? value : alpha * value + (1 - alpha) * prev;
    prev = ema;
    data.push({ timestamp, value, ema });
    if (data.length > maxPoints) data.shift();
  }

  if (!data.length) return { data, path: '' };

  const x = scaleLinear()
    .domain([data[0].timestamp, data[data.length - 1].timestamp])
    .range([0, width]);

  const y = scaleLinear()
    .domain(yDomain)
    .range([height, 0]);

  const curve = line()
    .x(d => x(d.timestamp))
    .y(d => y(d.ema));

  return { data, path: curve(data) };
};
export default createStreamVisualizer;