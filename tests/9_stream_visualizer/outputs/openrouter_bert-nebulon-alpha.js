const createStreamVisualizer = async (asyncIterable, {
  maxPoints = 1000,
  alpha = 0.3,
  width = 800,
  height = 400,
  yDomain = [0, 1]
} = {}) => {
  const { scaleLinear, line } = await import('https://cdn.skypack.dev/d3@7');
  const data = [];
  let prevEma;

  for await (const { timestamp, value } of asyncIterable) {
    const ema = prevEma === undefined
      ? value
      : alpha * value + (1 - alpha) * prevEma;
    prevEma = ema;

    data.push({ timestamp, value, ema });
    if (data.length > maxPoints) data.shift();
  }

  if (!data.length) return { data: [], path: '' };

  const xScale = scaleLinear()
    .domain([data[0].timestamp, data[data.length - 1].timestamp])
    .range([0, width]);

  const yScale = scaleLinear()
    .domain(yDomain)
    .range([height, 0]);

  const pathGenerator = line()
    .x(d => xScale(d.timestamp))
    .y(d => yScale(d.ema));

  return {
    data,
    path: pathGenerator(data)
  };
};
export default createStreamVisualizer;