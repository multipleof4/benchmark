async function analyzeGPS(readings, boundary) {
  const turf = await import('https://cdn.jsdelivr.net/npm/@turf/turf/+esm');

  const pts = readings
    .filter(({ loc }) => turf.booleanPointInPolygon(loc, boundary, { ignoreBoundary: true }))
    .sort((a, b) => a.ts - b.ts)
    .map(({ loc }) => loc);

  return pts.length < 2
    ? 0
    : +turf.length(turf.lineString(pts), { units: 'kilometers' }).toFixed(2);
}
export default analyzeGPS;
// Generation time: 36.478s
// Result: PASS