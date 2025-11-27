async function analyzeGPS(readings, boundary) {
  const isValid = r => r?.ts != null && Array.isArray(r?.loc) && r.loc.length === 2;
  const valid = readings?.filter(isValid) || [];
  if (valid.length < 2) return 0;
  
  const turf = await import('https://cdn.skypack.dev/@turf/turf').catch(() => null);
  if (!turf) return 0;
  
  const points = valid
    .filter(r => turf.booleanPointInPolygon(r.loc, boundary))
    .sort((a, b) => a.ts - b.ts)
    .map(r => r.loc);
  
  return points.length < 2 ? 0 : Math.round(turf.length(turf.lineString(points), {units: 'kilometers'}) * 100) / 100;
}
export default analyzeGPS;
// Generation time: 48.580s
// Result: PASS