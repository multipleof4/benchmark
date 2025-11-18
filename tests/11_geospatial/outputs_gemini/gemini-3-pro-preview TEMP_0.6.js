const analyzeGPS = async (readings, boundary) => {
  const t = await import('https://esm.sh/@turf/turf');
  const pts = readings
    .filter(r => t.booleanPointInPolygon(t.point(r.loc), boundary, { ignoreBoundary: true }))
    .sort((a, b) => a.ts - b.ts)
    .map(r => r.loc);

  return pts.length < 2 ? 0 : +t.length(t.lineString(pts), { units: 'kilometers' }).toFixed(2);
};
export default analyzeGPS;