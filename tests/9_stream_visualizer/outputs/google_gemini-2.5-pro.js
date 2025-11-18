async function createStreamVisualizer(
  asyncIterable,
  { maxPoints, alpha, width, height, yDomain }
) {
  const { scaleLinear, line } = await import('d3');
  const data = [];
  let ema = null;

  for await (const point of asyncIterable) {
    ema = ema === null ? point.value : alpha * point.value + (1 - alpha) * ema;
    data.push({ ...point, ema });
    if (data.length > maxPoints) {
      data.shift();
    }
  }

  if (data.length < 2) {
    return { data, path: "" };
  }

  const x = scaleLinear(
    [data[0].timestamp, data.at(-1).timestamp],
    [0, width]
  );
  const y = scaleLinear(yDomain, [height, 0]);

  const path = line()
    .x(p => x(p.timestamp))
    .y(p => y(p.ema))(data);

  return { data, path };
}
export default createStreamVisualizer;