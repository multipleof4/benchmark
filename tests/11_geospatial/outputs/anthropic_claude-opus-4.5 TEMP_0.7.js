async function analyzeGPS(readings, boundary) {
  const turf = await import("https://esm.sh/@turf/turf");
  const valid = readings
    .filter(r => turf.booleanPointInPolygon(turf.point(r.loc), boundary, { ignoreBoundary: true }))
    .sort((a, b) => a.ts - b.ts);
  if (valid.length < 2) return 0;
  const line = turf.lineString(valid.map(r => r.loc));
  return Math.round(turf.length(line, { units: "kilometers" }) * 100) / 100;
}
export default analyzeGPS;
// Generation time: 3.155s
// Result: PASS