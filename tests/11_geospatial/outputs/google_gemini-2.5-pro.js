const analyzeGPS = async (readings, boundary) => {
  const t = await import('https://cdn.jsdelivr.net/npm/@turf/turf');

  const sortedLocations = readings
    .filter(r => t.booleanPointInPolygon(r.loc, boundary, { ignoreBoundary: true }))
    .sort((a, b) => a.ts - b.ts)
    .map(r => r.loc);

  if (sortedLocations.length < 2) {
    return 0;
  }

  const path = t.lineString(sortedLocations);
  const length = t.length(path, { units: 'kilometers' });

  return Math.round(length * 100) / 100;
};
export default analyzeGPS;