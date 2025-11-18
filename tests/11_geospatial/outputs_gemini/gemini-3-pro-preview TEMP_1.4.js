const analyzeGPS = async (readings, boundary) => {
  const { booleanPointInPolygon: inside, point, lineString, length } = await import('https://cdn.jsdelivr.net/npm/@turf/turf/+esm')

  const path = readings
    .filter(({ loc }) => inside(point(loc), boundary, { ignoreBoundary: true }))
    .sort((a, b) => a.ts - b.ts)
    .map(({ loc }) => loc)

  if (path.length < 2) return 0

  return +length(lineString(path), { units: 'kilometers' }).toFixed(2)
}
export default analyzeGPS;