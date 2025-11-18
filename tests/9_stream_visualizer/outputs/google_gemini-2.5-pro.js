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
  let prevEma;

  for await (const { value, timestamp } of asyncIterable) {
    prevEma = (prevEma === undefined) ?
      value :
      alpha * value + (1 - alpha) * prevEma;

    data.push({
      timestamp,
      value,
      ema: prevEma
    });
    if (data.length > maxPoints) {
      data.shift();
    }
  }

  if (!data.length) {
    return {
      data,
      path: ''
    };
  }

  const x = scaleLinear([data[0].timestamp, data.at(-1).timestamp], [0, width]);
  const y = scaleLinear(yDomain, [height, 0]);

  const path = line()
    .x(d => x(d.timestamp))
    .y(d => y(d.ema))(data);

  return {
    data,
    path: path ?? ''
  };
}
export default createStreamVisualizer;