const analyzeGPS = async (readings, boundary) => {
  const turf = await import('https://cdn.skypack.dev/@turf/turf');
  const inside = readings.filter(r => turf.booleanPointInPolygon(turf.point(r.loc), boundary));
  if (inside.length < 2) return 0;
  const sorted = inside.sort((a, b) => a.ts - b.ts);
  const line = turf.lineString(sorted.map(r => r.loc));
  const length = turf.length(line, { units: 'kilometers' });
  return Math.round(length * 100) / 100;
};
export default analyzeGPS;
// Generation time: 5.688s
// Result: PASS