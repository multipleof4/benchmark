const analyzeGPS = async (readings, boundary) => {
  const { booleanPointInPolygon, point, lineString, length } = 
    await import('https://cdn.jsdelivr.net/npm/@turf/turf/+esm')

  const valid = readings
    .filter(({ loc }) => booleanPointInPolygon(point(loc), boundary, { ignoreBoundary: true }))
    .sort((a, b) => a.ts - b.ts)
    .map(({ loc }) => loc)

  return valid.length < 2 ? 0 :
    Math.round(length(lineString(valid), { units: 'kilometers' }) * 100) / 100
}
export default analyzeGPS;