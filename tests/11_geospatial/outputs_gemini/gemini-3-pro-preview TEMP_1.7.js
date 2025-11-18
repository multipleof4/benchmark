const analyzeGPS = async (readings, boundary) => {
  const { point, booleanPointInPolygon, lineString, length } = await import('https://cdn.jsdelivr.net/npm/@turf/turf/+esm');
  
  const path = readings
    .filter(({ loc }) => booleanPointInPolygon(point(loc), boundary, { ignoreBoundary: true }))
    .sort((a, b) => a.ts - b.ts)
    .map(r => r.loc);

  return path.length < 2 ? 0 : +length(lineString(path)).toFixed(2);
};
export default analyzeGPS;