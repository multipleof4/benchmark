export const createStreamVisualizer = async (stream, { maxPoints: M, alpha: A, width: W, height: H, yDomain: Y }) => {
  const { scaleLinear, line } = await import('https://esm.sh/d3@7');
  const data = [];
  let ema;

  for await (const { timestamp: t, value: v } of stream) {
    ema = ema === undefined ? v : A * v + (1 - A) * ema;
    data.push({ timestamp: t, value: v, ema });
    if (data.length > M) data.shift();
  }

  if (!data.length) return { data, path: '' };

  const x = scaleLinear().domain([data[0].timestamp, data.at(-1).timestamp]).range([0, W]);
  const y = scaleLinear().domain(Y).range([H, 0]);
  const gen = line().x(d => x(d.timestamp)).y(d => y(d.ema));

  return { data, path: gen(data) };
};
export default createStreamVisualizer;