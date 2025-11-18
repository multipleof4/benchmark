const analyzeGPS = async (readings, boundary) => {
  const { booleanPointInPolygon, point, lineString, length } = await import('https://esm.sh/@turf/turf')

  const path = readings
    .filter(({ loc }) => booleanPointInPolygon(point(loc), boundary))
    .sort((a, b) => a.ts - b.ts)
    .map(({ loc }) => loc)

  if (path.length < 2) return 0

  const dist = length(lineString(path), { units: 'kilometers' })
  return Math.round(dist * 100) / 100
}
export default analyzeGPS;