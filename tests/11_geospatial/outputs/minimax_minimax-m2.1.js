async function analyzeGPS(readings, boundary) {
  if (!readings?.length) return 0;
  const turf = await import('https://cdn.skypack.dev/@turf/turf');
  const valid = readings.filter(r => turf.booleanPointInPolygon(r.loc, boundary));
  valid.sort((a, b) => a.ts - b.ts);
  if (valid.length < 2) return 0;
  const line = turf.lineString(valid.map(r => r.loc));
  return Math.round(turf.length(line, { units: 'kilometers' }) * 100) / 100;
}
export default analyzeGPS;
// Generation time: 6.167s
// Result: PASS