const TURF_SRC = "https://cdn.jsdelivr.net/npm/@turf/turf@6.5.0/+esm"
let turfP
const turf = () => turfP || (turfP = import(TURF_SRC))

async function analyzeGPS(readings, boundary) {
  if (!Array.isArray(readings) || !boundary) return 0

  const {
    point: pt,
    booleanPointInPolygon: inPoly,
    lineString: ls,
    length: len
  } = await turf()

  const ok = []
  for (const r of readings) {
    const ts = +r?.ts
    const loc = [+r?.loc?.[0], +r?.loc?.[1]]
    if (!Number.isFinite(ts) || loc.some(n => !Number.isFinite(n))) continue
    if (inPoly(pt(loc), boundary, { ignoreBoundary: true })) ok.push({ ts, loc })
  }

  if (ok.length < 2) return 0
  ok.sort((a, b) => a.ts - b.ts)

  const km = len(ls(ok.map(r => r.loc)), { units: "kilometers" })
  return Number.isFinite(km) ? +km.toFixed(2) : 0
}
export default analyzeGPS;
// Generation time: 113.549s
// Result: PASS