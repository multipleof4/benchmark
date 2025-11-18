async function analyzeGPS(readings, boundary) {
  try {
    if (!Array.isArray(readings) || !boundary) return 0;
    const turf = await import('https://cdn.skypack.dev/@turf/turf'),
          v = readings.filter(r => r?.loc && turf.booleanPointInPolygon(r.loc, boundary, {ignoreBoundary: true}))
                     .sort((a, b) => a.ts - b.ts);
    return v.length < 2 ? 0 : Math.round(turf.length(turf.lineString(v.map(r => r.loc)), {units: 'kilometers'}) * 100) / 100;
  } catch {
    return 0;
  }
}
export default analyzeGPS;