export const createStreamVisualizer = async (stream, { maxPoints, alpha, width, height, yDomain }) => {
  const { scaleLinear, line } = await import('d3');
  const data = [];
  let ema;

  for await (const { timestamp, value } of stream) {
    ema = (ema ?? value) * (1 - alpha) + value * alpha;
    data.push({ timestamp, value, ema });
    if (data.length > maxPoints) data.shift();
  }

  if (!data.length) return { data, path: '' };

  const x = scaleLinear()
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