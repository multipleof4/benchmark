export const createStreamVisualizer = async (iter, { maxPoints: max, alpha, width: w, height: h, yDomain }) => {
  const { scaleTime, scaleLinear, line } = await import('https://esm.sh/d3');
  const data = [];
  let prev;

  for await (const { timestamp: t, value: v } of iter) {
    const ema = prev == null ? v : alpha * v + (1 - alpha) * prev;
    data.push({ timestamp: t, value: v, ema });
    if (data.length > max) data.shift();
    prev = ema;
  }

  if (!data.length) return { data, path: '' };

  const x = scaleTime().domain([data[0].timestamp, data.at(-1).timestamp]).range([0, w]);
  const y = scaleLinear().domain(yDomain).range([h, 0]);
  
  return {
    data,
    path: line().x(d => x(d.timestamp)).y(d => y(d.ema))(data)
  };
};
export default createStreamVisualizer;