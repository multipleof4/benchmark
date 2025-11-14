async function createStreamVisualizer(asyncIterable, {
  maxPoints,
  alpha,
  width,
  height,
  yDomain
}) {
  const {
    scaleLinear,
    line
  } = await import('d3');

  const data = [];
  let prevEma = null;

  for await (const {
      timestamp,
      value
    } of asyncIterable) {
    const ema = prevEma === null ?
      value :
      alpha * value + (1 - alpha) * prevEma;

    data.push({
      timestamp,
      value,
      ema
    });
    prevEma = ema;

    if (data.length > maxPoints) {
      data.shift();
    }
  }

  if (data.length < 2) {
    return {
      data,
      path: ''
    };
  }

  const x = scaleLinear()
    .domain([data[0].timestamp, data.at(-1).timestamp])
    .range([0, width]);

  const y = scaleLinear()
    .domain(yDomain)
    .range([height, 0]);

  const path = line()
    .x(d => x(d.timestamp))
    .y(d => y(d.ema))(data);

  return {
    data,
    path
  };
}
export default createStreamVisualizer;