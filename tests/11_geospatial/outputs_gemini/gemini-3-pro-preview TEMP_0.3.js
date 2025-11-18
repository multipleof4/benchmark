const analyzeGPS = async (readings, boundary) => {
  const T = await import('https://esm.sh/@turf/turf');
  
  const pts = readings
    .filter(r => T.booleanPointInPolygon(T.point(r.loc), boundary, { ignoreBoundary: true }))
    .sort((a, b) => a.ts - b.ts)
    .map(r => r.loc);

  if (pts.length < 2) return 0;

  const len = T.length(T.lineString(pts), { units: 'kilometers' });
  return Math.round(len * 100) / 100;
};
export default analyzeGPS;