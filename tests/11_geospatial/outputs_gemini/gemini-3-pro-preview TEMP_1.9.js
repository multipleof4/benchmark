const analyzeGPS = async (readings, boundary) => {
  const T = await import('https://esm.sh/@turf/turf')
  const valid = readings
    .filter(r => T.booleanPointInPolygon(T.point(r.loc), boundary))
    .sort((a, b) => a.ts - b.ts)

  if (valid.length < 2) return 0

  const line = T.lineString(valid.map(v => v.loc))
  return Math.round(T.length(line) * 1e2) / 1e2
}
export default analyzeGPS;