export const createStreamVisualizer = async (feed, { maxPoints: m, alpha: a, width: w, height: h, yDomain: yd }) => {
  const { scaleLinear, line } = await import('https://esm.sh/d3');
  let data = [], ema;

  for await (const { timestamp: t, value: v } of feed) {
    ema = ema == null ? v : a * v + (1 - a) * ema;
    data.push({ timestamp: t, value: v, ema });
    if (data.length > m) data.shift();
  }

  if (!data.length) return { data, path: "" };

  const x = scaleLinear()
    .domain([data[0].timestamp, data.at(-1).timestamp])
    .range([0, w]);

  const y = scaleLinear()
    .domain(yd)
    .range([h, 0]);

  const gen = line()
    .x(d => x(d.timestamp))
    .y(d => y(d.ema));

  return { data, path: gen(data) };
};
export default createStreamVisualizer;