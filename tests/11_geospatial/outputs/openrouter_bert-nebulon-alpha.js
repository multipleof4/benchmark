export const analyzeGPS = async (readings, boundary) => {
  const { default: turf } = await import('https://unpkg.com/@turf/turf@6/turf.min.js')

  const inside = readings.filter(({ loc }) =>
    turf.booleanPointInPolygon(turf.point(loc), boundary, { ignoreBoundary: false })
  )

  if (inside.length < 2) return 0

  const sorted = inside.sort((a, b) => a.ts - b.ts)
  const line = turf.lineString(sorted.map(({ loc }) => loc))
  const length = turf.length(line, { units: 'kilometers' })

  return Math.round(length * 100) / 100
}
export default analyzeGPS;