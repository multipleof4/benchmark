export async function analyzeGPS(readings, boundary) {
  const { booleanPointInPolygon, lineString, length } = await import('https://cdn.skypack.dev/@turf/turf');
  
  const pts = readings
    .filter(r => booleanPointInPolygon(r.loc, boundary))
    .sort((a, b) => a.ts - b.ts)
    .map(r => r.loc);
  
  return pts.length < 2 ? 0 : +length(lineString(pts)).toFixed(2);
}
export default analyzeGPS;