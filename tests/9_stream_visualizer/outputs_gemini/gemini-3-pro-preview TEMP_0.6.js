export const createStreamVisualizer = async (stream, { maxPoints, alpha, width, height, yDomain }) => {
  const { scaleLinear, line } = await import('https://esm.sh/d3');
  const data = [];

  for await (const { timestamp: t, value: v } of stream) {
    const prev = data.at(-1);
    data.push({ timestamp: t, value: v, ema: prev ? alpha * v + (1 - alpha) * prev.ema : v });
    if (data.length > maxPoints) data.shift();
  }

  if (!data.length) return { data, path: '' };

  const x = scaleLinear().domain([data[0].timestamp, data.at(-1).timestamp]).range([0, width]);
  const y = scaleLinear().domain(yDomain).range([height, 0]);
  const gen = line().x(d => x(d.timestamp)).y(d => y(d.ema));

  return { data, path: gen(data) };
};
export default createStreamVisualizer;