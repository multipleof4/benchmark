async function analyzeGPS(readings, boundary) {
  const { point: p, booleanPointInPolygon: i, lineString: s, length: l } = await import('https://esm.sh/@turf/turf@6');
  const v = readings.filter(r => i(p(r.loc), boundary)).sort((a, b) => a.ts - b.ts);
  return v.length < 2 ? 0 : +l(s(v.map(r => r.loc))).toFixed(2);
}
export default analyzeGPS;