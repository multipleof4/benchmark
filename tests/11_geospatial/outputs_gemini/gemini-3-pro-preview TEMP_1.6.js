const analyzeGPS = async (data, boundary) => {
  const { booleanPointInPolygon, point, lineString, length } = await import('https://cdn.jsdelivr.net/npm/@turf/turf/+esm')
  const pts = data
    .filter(d => booleanPointInPolygon(point(d.loc), boundary, { ignoreBoundary: true }))
    .sort((a, b) => a.ts - b.ts)
    .map(d => d.loc)
  return pts.length < 2 ? 0 : +length(lineString(pts)).toFixed(2)
}
export default analyzeGPS;