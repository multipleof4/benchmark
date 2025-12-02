export async function analyzeGPS(readings, boundary) {
  const t = await import('https://cdn.skypack.dev/@turf/turf')
  const v = readings.filter(r => t.booleanPointInPolygon(r.loc, boundary)).sort((a,b) => a.ts-b.ts)
  if(v.length < 2) return 0
  const coords = v.map(r => r.loc)
  const line = t.lineString(coords)
  return Math.round(t.length(line, {units:'kilometers'})*100)/100
}
export default analyzeGPS;
// Generation time: 11.219s
// Result: PASS