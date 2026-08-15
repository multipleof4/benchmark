export async function analyzeGPS(readings, boundary) {
  const { booleanPointInPolygon, lineString, length } = await import('https://esm.sh/@turf/turf');

  const pts = readings
    .filter(r => booleanPointInPolygon(r.loc, boundary))
    .sort((a, b) => a.ts - b.ts)
    .map(r => r.loc);

  if (pts.length < 2) return 0;

  const totalLength = length(lineString(pts), { units: 'kilometers' });
  return +totalLength.toFixed(2);
}
export default analyzeGPS;
// Generation time: 9.365s
// Result: PASS