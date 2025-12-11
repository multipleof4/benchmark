let turf$;

async function analyzeGPS(readings, boundary) {
  turf$ ||= import("https://esm.sh/@turf/turf@6.5.0");
  const { point, booleanPointInPolygon, lineString, length } = await turf$;

  const coords = (readings || [])
    .filter(r => r && Array.isArray(r.loc) && r.loc.length === 2 && Number.isFinite(r.ts))
    .filter(r => booleanPointInPolygon(point(r.loc), boundary, { ignoreBoundary: true }))
    .sort((a, b) => a.ts - b.ts)
    .map(r => r.loc);

  if (coords.length < 2) return 0;

  const km = length(lineString(coords), { units: "kilometers" });
  return +km.toFixed(2);
}
export default analyzeGPS;
// Generation time: 7.395s
// Result: PASS