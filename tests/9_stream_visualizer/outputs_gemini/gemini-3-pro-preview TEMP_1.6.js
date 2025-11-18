export const createStreamVisualizer = async (stream, { maxPoints, alpha, width, height, yDomain }) => {
  const { scaleTime, scaleLinear, line } = await import('https://esm.sh/d3@7');
  const data = [];
  let ema;

  for await (const { timestamp, value } of stream) {
    ema = alpha * value + (1 - alpha) * (ema ?? value);
    data.push({ timestamp, value, ema });
    if (data.length > maxPoints) data.shift();
  }

  if (!data.length) return { data, path: '' };

  const getX = scaleTime().domain([data[0].timestamp, data.at(-1).timestamp]).range([0, width]);
  const getY = scaleLinear().domain(yDomain).range([height, 0]);
  const gen = line().x(d => getX(d.timestamp)).y(d => getY(d.ema));

  return { data, path: gen(data) };
};
export default createStreamVisualizer;