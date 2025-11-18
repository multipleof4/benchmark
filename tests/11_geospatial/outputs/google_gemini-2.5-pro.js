const analyzeGPS = async (readings, boundary) => {
  const { booleanPointInPolygon, lineString, length } = await import('https://cdn.jsdelivr.net/npm/@turf/turf/+esm');

  const sortedCoords = readings
    .filter(({ loc }) => booleanPointInPolygon(loc, boundary, { ignoreBoundary: true }))
    .sort((a, b) => a.ts - b.ts)
    .map(({ loc }) => loc);

  if (sortedCoords.length < 2) {
    return 0;
  }

  const path = lineString(sortedCoords);
  const dist = length(path, { units: 'kilometers' });

  return Math.round(dist * 1e2) / 1e2;
};
export default analyzeGPS;