const createStreamVisualizer = async (src, { maxPoints: m, alpha: a, width: w, height: h, yDomain: yd }) => {
  const { scaleLinear, line } = await import('https://esm.sh/d3@7');
  const D = [];
  let e;

  for await (const { timestamp: t, value: v } of src) {
    e = e === undefined ? v : a * v + (1 - a) * e;
    D.push({ timestamp: t, value: v, ema: e });
    if (D.length > m) D.shift();
  }

  if (!D.length) return { data: D, path: '' };

  const x = scaleLinear().domain([D[0].timestamp, D[D.length - 1].timestamp]).range([0, w]);
  const y = scaleLinear().domain(yd).range([h, 0]);
  const l = line().x(d => x(d.timestamp)).y(d => y(d.ema));

  return { data: D, path: l(D) };
};
export default createStreamVisualizer;