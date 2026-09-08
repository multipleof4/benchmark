export async function analyzeGPS(readings, boundary) {
  const turf = await import('https://esm.sh/@turf/turf');

  const pts = readings
    .filter(r => turf.booleanPointInPolygon(r.loc, boundary, { ignoreBoundary: true }))
    .sort((a, b) => a.ts - b.ts)
    .map(r => r.loc);

  return pts.length < 2
    ? 0
    : +turf.length(turf.lineString(pts), { units: 'kilometers' }).toFixed(2);
}
export default analyzeGPS;
// Generation time: 24.485s
// Result: PASS