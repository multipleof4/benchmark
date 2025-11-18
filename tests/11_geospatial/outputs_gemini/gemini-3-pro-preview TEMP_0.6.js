const analyzeGPS = async (readings, boundary) => {
  const { booleanPointInPolygon, point, lineString, length } = await import('https://cdn.jsdelivr.net/npm/@turf/turf/+esm')
  
  const path = readings
    .filter(({ loc }) => booleanPointInPolygon(point(loc), boundary, { ignoreBoundary: true }))
    .sort((a, b) => a.ts - b.ts)
    .map(r => r.loc)

  return path.length < 2 ? 0 :
    Math.round(length(lineString(path), { units: 'kilometers' }) * 100) / 100
}
export default analyzeGPS;