export async function analyzeGPS(readings, boundary) {
  const T = await import('https://cdn.jsdelivr.net/npm/@turf/turf/+esm');

  const pts = readings
    .filter(({ loc }) => T.booleanPointInPolygon(loc, boundary))
    .sort((a, b) => a.ts - b.ts)
    .map(({ loc }) => loc);

  if (pts.length < 2) return 0;

  const len = T.length(T.lineString(pts), { units: 'kilometers' });

  return Math.round(len * 100) / 100;
}
export default analyzeGPS;
// Generation time: 9.884s
// Result: PASS