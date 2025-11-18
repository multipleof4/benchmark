export const createStreamVisualizer = async (src, { maxPoints: max, alpha: a, width: w, height: h, yDomain: yD }) => {
  const { scaleTime, scaleLinear, line } = await import('https://esm.sh/d3');
  const data = [];
  let ema;

  for await (const { timestamp: t, value: v } of src) {
    ema = ema == null ? v : a * v + (1 - a) * ema;
    data.push({ timestamp: t, value: v, ema });
    if (data.length > max) data.shift();
  }

  if (!data.length) return { data, path: '' };

  const x = scaleTime().domain([data[0].timestamp, data.at(-1).timestamp]).range([0, w]);
  const y = scaleLinear().domain(yD).range([h, 0]);
  const path = line().x(d => x(d.timestamp)).y(d => y(d.ema))(data);

  return { data, path: path || '' };
};
export default createStreamVisualizer;