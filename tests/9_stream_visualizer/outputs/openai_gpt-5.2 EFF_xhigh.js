const d3Url = "https://cdn.jsdelivr.net/npm/d3@7/+esm";
let d3p;

const loadD3 = () => d3p || (d3p = import(d3Url));
const toNum = v => (typeof v == "string" && !v.trim() ? NaN : +v);
const toTime = t => (t instanceof Date ? +t : typeof t == "string" && isNaN(+t) ? Date.parse(t) : +t);

const asPoint = p => {
  if (p == null) return {};
  if (typeof p == "number") return { timestamp: Date.now(), value: p };
  if (Array.isArray(p)) return { timestamp: toTime(p[0]), value: toNum(p[1]) };
  if (typeof p == "object")
    return {
      timestamp: toTime(p.timestamp ?? p.time ?? p.t),
      value: toNum(p.value ?? p.v ?? p.y)
    };
  return {};
};

async function createStreamVisualizer(asyncIterable, o = {}) {
  const { scaleLinear, line } = await loadD3();

  let {
    maxPoints = 500,
    alpha = 0.2,
    width = 600,
    height = 200,
    yDomain = [0, 1]
  } = o;

  maxPoints =
    maxPoints === Infinity
      ? Infinity
      : Number.isFinite(+maxPoints)
        ? Math.max(1, Math.floor(+maxPoints))
        : 500;

  alpha = Number.isFinite(+alpha) ? Math.min(1, Math.max(0, +alpha)) : 0.2;
  width = Math.max(0, +width || 0);
  height = Math.max(0, +height || 0);

  const data = [];
  let ema, seeded = false;

  for await (const item of asyncIterable) {
    const { timestamp, value } = asPoint(item);
    if (!Number.isFinite(timestamp) || !Number.isFinite(value)) continue;

    ema = seeded ? alpha * value + (1 - alpha) * ema : (seeded = true, value);
    data.push({ timestamp, value, ema });
    if (data.length > maxPoints) data.splice(0, data.length - maxPoints);
  }

  if (!data.length) return { data, path: "" };

  let t0 = data[0].timestamp,
    t1 = data[data.length - 1].timestamp;
  if (t0 === t1) t1 = t0 + 1;

  let [y0, y1] = Array.isArray(yDomain) ? yDomain : [0, 1];
  y0 = toNum(y0);
  y1 = toNum(y1);
  if (!Number.isFinite(y0) || !Number.isFinite(y1)) (y0 = 0), (y1 = 1);
  if (y0 === y1) y1 = y0 + 1;

  const x = scaleLinear().domain([t0, t1]).range([0, width]);
  const y = scaleLinear().domain([y0, y1]).range([height, 0]);

  const path = line()
    .x(d => x(d.timestamp))
    .y(d => y(d.ema))(data) || "";

  return { data, path };
}
export default createStreamVisualizer;
// Generation time: 140.623s
// Result: PASS