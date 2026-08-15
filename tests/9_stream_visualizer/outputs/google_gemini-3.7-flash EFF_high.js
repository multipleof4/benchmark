export async function createStreamVisualizer(
  asyncIterable,
  { maxPoints = Infinity, alpha = 0.5, width = 800, height = 400, yDomain = [0, 100] } = {}
) {
  const { scaleLinear, line } = await import('d3');
  const data = [];
  let ema;

  for await (const { timestamp, value } of asyncIterable) {
    ema = ema === undefined ? value : alpha * value + (1 - alpha) * ema;
    data.push({ timestamp, value, ema });
    if (data.length > maxPoints) data.shift();
  }

  if (!data.length) return { data, path: '' };

  const x = scaleLinear().domain([data[0].timestamp, data.at(-1).timestamp]).range([0, width]);
  const y = scaleLinear().domain(yDomain).range([height, 0]);
  const path = line().x(d => x(d.timestamp)).y(d => y(d.ema))(data) ?? '';

  return { data, path };
}
export default createStreamVisualizer;
// Generation time: 11.140s
// Result: FAIL