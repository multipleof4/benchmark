async function createStreamVisualizer(asyncIterable, o = {}) {
  let {
    maxPoints = 500,
    alpha = 0.2,
    width = 600,
    height = 200,
    yDomain = [0, 1]
  } = o

  alpha = +alpha
  if (!(alpha >= 0 && alpha <= 1)) alpha = 0.2

  let d3 = await import("https://cdn.jsdelivr.net/npm/d3@7/+esm")
  let data = [], ema, seeded = false

  for await (let p of asyncIterable) {
    let timestamp, value

    if (Array.isArray(p)) [timestamp, value] = p
    else if (p && typeof p == "object") ({ timestamp, value } = p)
    else (timestamp = Date.now()), (value = p)

    timestamp = +timestamp
    value = +value

    if (!seeded) (ema = value), (seeded = true)
    else ema = alpha * value + (1 - alpha) * ema

    data.push({ timestamp, value, ema })

    if (data.length > maxPoints) data.splice(0, data.length - maxPoints)
  }

  let path = ""
  if (data.length) {
    let t0 = data[0].timestamp, t1 = data.at(-1).timestamp
    if (t0 === t1) t1 = t0 + 1

    let x = d3.scaleLinear().domain([t0, t1]).range([0, width])
    let y = d3.scaleLinear().domain(yDomain).range([height, 0])
    path = d3.line().x(d => x(d.timestamp)).y(d => y(d.ema))(data) || ""
  }

  return { data, path }
}
export default createStreamVisualizer;
// Generation time: 18.105s
// Result: PASS