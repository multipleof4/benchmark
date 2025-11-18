export const createStreamVisualizer = async (src, { maxPoints: m, alpha: a, width: w, height: h, yDomain: yd }) => {
  const { scaleLinear, line } = await import('https://esm.sh/d3@7');
  const data = [];
  let ema;

  for await (const { timestamp: t, value: v } of src) {
    ema = ema === undefined ? v : a * v + (1 - a) * ema;
    data.push({ timestamp: t, value: v, ema });
    if (data.length > m) data.shift();
  }

  if (!data.length) return { data, path: '' };

  const x = scaleLinear().domain([data[0].timestamp, data.at(-1).timestamp]).range([0, w]);
  const y = scaleLinear().domain(yd).range([h, 0]);
  const d = line().x(p => x(p.timestamp)).y(p => y(p.ema))(data);

  return { data, path: d || '' };
};
export default createStreamVisualizer;