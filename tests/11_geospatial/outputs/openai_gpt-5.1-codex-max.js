async function analyzeGPS(readings, boundary) {
  const { point, booleanPointInPolygon, lineString, length } = await import('https://cdn.skypack.dev/@turf/turf')
  const v = readings.filter(r => booleanPointInPolygon(point(r.loc), boundary, { ignoreBoundary: true })).sort((a, b) => a.ts - b.ts)
  if (v.length < 2) return 0
  const l = lineString(v.map(r => r.loc))
  return +length(l, { units: 'kilometers' }).toFixed(2)
}
export default analyzeGPS;
// Generation time: 10.671s
// Result: PASS