export async function createStreamVisualizer(asyncIterable, { maxPoints, alpha, width, height, yDomain }) {
  const [d3, data] = await Promise.all([
    import('d3'),
    (async () => {
      const buffer = [];
      let ema;
      for await (const { timestamp, value } of asyncIterable) {
        ema = ema == null ? value : alpha * value + (1 - alpha) * ema;
        buffer.push({ timestamp, value, ema });
        if (buffer.length > maxPoints) buffer.shift();
      }
      return buffer;
    })()
  ]);

  if (!data.length) return { data, path: '' };

  const x = d3.scaleLinear()
    .domain([data[0].timestamp, data.at(-1).timestamp])
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain(yDomain)
    .range([height, 0]);

  const path = d3.line()
    .x(d => x(d.timestamp))
    .y(d => y(d.ema))(data) ?? '';

  return { data, path };
}
export default createStreamVisualizer;
// Generation time: 21.189s
// Result: FAIL