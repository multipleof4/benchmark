export const createStreamVisualizer = async (src, { maxPoints: m, alpha: a, width: w, height: h, yDomain: yD }) => {
  const data = [];
  let ema;

  for await (const { timestamp: t, value: v } of src) {
    ema = ema == null ? v : a * v + (1 - a) * ema;
    data.push({ timestamp: t, value: v, ema });
    if (data.length > m) data.shift();
  }

  if (!data.length) return { data, path: '' };

  const { scaleLinear, line } = await import('d3');
  
  const x = scaleLinear()
    .domain([data[0].timestamp, data[data.length - 1].timestamp])
    .range([0, w]);

  const y = scaleLinear()
    .domain(yD)
    .range([h, 0]);

  return {
    data,
    path: line().x(d => x(d.timestamp)).y(d => y(d.ema))(data)
  };
};
export default createStreamVisualizer;