export async function createStreamVisualizer(stream, opts = {}) {
  const {
    maxPoints = 1000,
    alpha = 0.2,
    width = 800,
    height = 300,
    yDomain = [-1, 1]
  } = opts;

  if (alpha <= 0 || alpha >= 1 || !Number.isFinite(alpha))
    throw new Error('alpha must be in (0,1)');
  if (!Array.isArray(yDomain) || yDomain.length !== 2 || !yDomain.every(Number.isFinite))
    throw new Error('yDomain must be a [min, max] pair of numbers');

  const d3 = await import('https://cdn.jsdelivr.net/npm/d3@7/+esm');

  const buf = [];
  let prevEma = undefined;

  for await (const p of stream) {
    if (!p || !('timestamp' in p) || !('value' in p)) continue;
    const v = Number(p.value);
    if (!Number.isFinite(v)) continue;

    if (prevEma === undefined) prevEma = v;
    else prevEma = alpha * v + (1 - alpha) * prevEma;

    buf.push({ timestamp: p.timestamp, value: v, ema: prevEma });
    if (buf.length > maxPoints) buf.shift();
  }

  const data = buf;
  let path = '';

  if (data.length) {
    const xs = d3.scaleLinear()
      .domain([data[0].timestamp, data[data.length - 1].timestamp])
      .range([0, width]);

    const ys = d3.scaleLinear()
      .domain(yDomain)
      .range([height, 0]);

    const line = d3.line()
      .x(d => xs(d.timestamp))
      .y(d => ys(d.ema));

    path = line(data) || '';
  }

  return { data, path };
}
export default createStreamVisualizer;
// Generation time: 14.769s
// Result: PASS