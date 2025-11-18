export const createStreamVisualizer = async (src, { maxPoints: M, alpha: A, width: W, height: H, yDomain: YD }) => {
  const { scaleLinear, line } = await import('https://esm.sh/d3@7');
  const D = [];
  let E;

  for await (const { timestamp: t, value: v } of src) {
    E = E == null ? v : A * v + (1 - A) * E;
    D.push({ timestamp: t, value: v, ema: E });
    if (D.length > M) D.shift();
  }

  if (!D.length) return { data: [], path: '' };

  const x = scaleLinear().domain([D[0].timestamp, D.at(-1).timestamp]).range([0, W]);
  const y = scaleLinear().domain(YD).range([H, 0]);
  const l = line().x(d => x(d.timestamp)).y(d => y(d.ema));

  return { data: D, path: l(D) };
};
export default createStreamVisualizer;