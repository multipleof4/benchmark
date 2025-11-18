const analyzeGPS = async (readings, boundary) => {
  const t = await import('https://esm.sh/@turf/turf');
  
  const pts = readings
    .filter(({ loc }) => t.booleanPointInPolygon(t.point(loc), boundary, { ignoreBoundary: true }))
    .sort((a, b) => a.ts - b.ts)
    .map(({ loc }) => loc);

  return pts.length < 2 ? 0 : 
    Math.round(t.length(t.lineString(pts), { units: 'kilometers' }) * 100) / 100;
};
export default analyzeGPS;