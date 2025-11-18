const analyzeGPS = async (readings, boundary) => {
  const { booleanPointInPolygon, point, lineString, length } = await import('https://esm.sh/@turf/turf');
  
  const path = readings
    .filter(({ loc }) => booleanPointInPolygon(point(loc), boundary, { ignoreBoundary: true }))
    .sort((a, b) => a.ts - b.ts)
    .map(r => r.loc);

  return path.length < 2 ? 0 : +length(lineString(path)).toFixed(2);
};
export default analyzeGPS;