const analyzeGPS = async (readings, boundary) => {
  const { booleanPointInPolygon, point, lineString, length } = await import('https://esm.sh/@turf/turf');

  const pts = readings
    .filter(r => booleanPointInPolygon(point(r.loc), boundary, { ignoreBoundary: true }))
    .sort((a, b) => a.ts - b.ts)
    .map(r => r.loc);

  return pts.length < 2 ? 0 
    : +length(lineString(pts), { units: 'kilometers' }).toFixed(2);
};
export default analyzeGPS;