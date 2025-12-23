async function createStreamVisualizer(stream, { maxPoints, alpha, width, height, yDomain }) {
  const { scaleLinear, line } = await import('https://esm.sh/d3');
  const data = [];
  let ema;

  for await (const { value, timestamp = Date.now() } of stream) {
    ema = ema === undefined ? value : alpha * value + (1 - alpha) * ema;
    data.push({ timestamp, value, ema });
    if (data.length > maxPoints) data.shift();
  }

  const x = scaleLinear().domain([data[0]?.timestamp, data.at(-1)?.timestamp]).range([0, width]);
  const y = scaleLinear().domain(yDomain).range([height, 0]);

  return { data, path: line().x(d => x(d.timestamp)).y(d => y(d.ema))(data) };
}
export default createStreamVisualizer;
// Generation time: 111.818s
// Result: PASS