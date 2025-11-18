export const createStreamVisualizer = async (stream, { maxPoints, alpha, width, height, yDomain }) => {
  const { scaleLinear, scaleTime, line } = await import('https://esm.sh/d3@7');
  const data = [];
  let ema;

  for await (const { timestamp, value } of stream) {
    ema = ema === undefined ? value : alpha * value + (1 - alpha) * ema;
    data.push({ timestamp, value, ema });
    if (data.length > maxPoints) data.shift();
  }

  if (!data.length) return { data, path: '' };

  const x = scaleTime()
    .domain([data[0].timestamp, data.at(-1).timestamp])
    .range([0, width]);

  const y = scaleLinear()
    .domain(yDomain)
    .range([height, 0]);

  const path = line()
    .x(d => x(d.timestamp))
    .y(d => y(d.ema))(data);

  return { data, path };
};
export default createStreamVisualizer;