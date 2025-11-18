export const createStreamVisualizer = async (stream, { maxPoints, alpha, width, height, yDomain }) => {
  const data = [];
  let prev;

  for await (const { timestamp, value } of stream) {
    prev = prev ?? value;
    const ema = prev = alpha * value + (1 - alpha) * prev;
    data.push({ timestamp, value, ema });
    if (data.length > maxPoints) data.shift();
  }

  const { scaleLinear, line } = await import('https://cdn.jsdelivr.net/npm/d3@7/+esm');
  
  if (!data.length) return { data, path: '' };

  const x = scaleLinear()
    .domain([data[0].timestamp, data.at(-1).timestamp])
    .range([0, width]);

  const y = scaleLinear()
    .domain(yDomain)
    .range([height, 0]);

  return {
    data,
    path: line().x(d => x(d.timestamp)).y(d => y(d.ema))(data)
  };
};
export default createStreamVisualizer;