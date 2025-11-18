const createStreamVisualizer = async (feed, { maxPoints, alpha, width, height, yDomain }) => {
  const { scaleLinear, line } = await import('https://esm.sh/d3');
  const data = [];
  let prev;

  for await (const { timestamp, value } of feed) {
    const ema = prev == null ? value : alpha * value + (1 - alpha) * prev;
    prev = ema;
    data.push({ timestamp, value, ema });
    if (data.length > maxPoints) data.shift();
  }

  if (!data.length) return { data, path: '' };

  const x = scaleLinear()
    .domain([data[0].timestamp, data.at(-1).timestamp])
    .range([0, width]);

  const y = scaleLinear()
    .domain(yDomain)
    .range([height, 0]);

  const generator = line()
    .x(d => x(d.timestamp))
    .y(d => y(d.ema));

  return { data, path: generator(data) || '' };
};
export default createStreamVisualizer;