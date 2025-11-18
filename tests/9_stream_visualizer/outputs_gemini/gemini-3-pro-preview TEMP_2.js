export const createStreamVisualizer = async (stream, { maxPoints: max, alpha, width, height, yDomain }) => {
  const { scaleLinear, line } = await import('https://esm.sh/d3');
  let data = [], prev;

  for await (const { timestamp, value } of stream) {
    const ema = prev == null ? value : alpha * value + (1 - alpha) * prev;
    data.push({ timestamp, value, ema });
    if (data.length > max) data.shift();
    prev = ema;
  }

  if (!data.length) return { data, path: "" };

  const x = scaleLinear().domain([data[0].timestamp, data.at(-1).timestamp]).range([0, width]);
  const y = scaleLinear().domain(yDomain).range([height, 0]);

  return {
    data,
    path: line().x(d => x(d.timestamp)).y(d => y(d.ema))(data)
  };
};
export default createStreamVisualizer;