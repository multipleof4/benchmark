export const createStreamVisualizer = async (iter, { maxPoints, alpha, width, height, yDomain }) => {
  const { scaleTime, scaleLinear, line } = await import('https://esm.sh/d3@7');
  const data = [];
  let prev;

  for await (const { timestamp, value } of iter) {
    const ema = prev == null ? value : alpha * value + (1 - alpha) * prev;
    prev = ema;
    data.push({ timestamp, value, ema });
    if (data.length > maxPoints) data.shift();
  }

  if (!data.length) return { data, path: "" };

  const x = scaleTime()
    .domain([data[0].timestamp, data.at(-1).timestamp])
    .range([0, width]);

  const y = scaleLinear()
    .domain(yDomain)
    .range([height, 0]);

  const d = line()
    .x(p => x(p.timestamp))
    .y(p => y(p.ema))(data);

  return { data, path: d };
};
export default createStreamVisualizer;