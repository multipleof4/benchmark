const analyzeGPS = async (readings, boundary) => {
  const { point, booleanPointInPolygon, lineString, length } = await import('https://esm.sh/@turf/turf')

  const path = readings
    .filter(({ loc }) => booleanPointInPolygon(point(loc), boundary))
    .sort((a, b) => a.ts - b.ts)
    .map(r => r.loc)

  return path.length < 2 ? 0 : +length(lineString(path), { units: 'kilometers' }).toFixed(2)
}
export default analyzeGPS;