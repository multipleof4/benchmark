const analyzeGPS = async (readings, boundary) => {
  const T = await import('https://esm.sh/@turf/turf');
  
  const pts = readings
    .filter(({ loc }) => T.booleanPointInPolygon(T.point(loc), boundary, { ignoreBoundary: true }))
    .sort((a, b) => a.ts - b.ts)
    .map(r => r.loc);

  return pts.length < 2 
    ? 0 
    : +T.length(T.lineString(pts), { units: 'kilometers' }).toFixed(2);
};
export default analyzeGPS;