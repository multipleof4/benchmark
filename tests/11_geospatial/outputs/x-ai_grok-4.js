async function analyzeGPS(readings, boundary) {
  const turf = await import('https://cdn.jsdelivr.net/npm/@turf/turf@6/turf.min.js');
  const valid = readings
    .filter(r => turf.booleanPointInPolygon(turf.point(r.loc), boundary))
    .sort((a, b) => a.ts - b.ts);
  if (valid.length < 2) return 0;
  const line = { type: 'LineString', coordinates: valid.map(r => r.loc) };
  const length = turf.length(line, { units: 'kilometers' });
  return Math.round(length * 100) / 100;
}
export default analyzeGPS;
// Generation time: 17.976s
// Result: FAIL