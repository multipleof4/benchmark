export const createStreamVisualizer = async (stream, { maxPoints: M, alpha: A, width: W, height: H, yDomain: Y }) => {
  const { scaleLinear, line } = await import('https://esm.sh/d3');
  const data = [];
  let ema;

  for await (const { timestamp: t, value: v } of stream) {
    ema = ema == null ? v : A * v + (1 - A) * ema;
    data.push({ timestamp: t, value: v, ema });
    if (data.length > M) data.shift();
  }

  if (!data.length) return { data, path: '' };

  const x = scaleLinear()
    .domain([data[0].timestamp, data[data.length - 1].timestamp])
    .range([0, W]);

  const y = scaleLinear()
    .domain(Y)
    .range([H, 0]);

  const path = line()
    .x(d => x(d.timestamp))
    .y(d => y(d.ema))(data);

  return { data, path };
};
export default createStreamVisualizer;
// Generation time: 18.404s
// Result: PASS