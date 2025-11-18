const analyzeGPS = async (readings, boundary) => {
  const turf = await import('https://cdn.jsdelivr.net/npm/@turf/turf/+esm');
  
  const pts = readings
    .filter(({ loc }) => turf.booleanPointInPolygon(turf.point(loc), boundary))
    .sort((a, b) => a.ts - b.ts)
    .map(r => r.loc);

  return pts.length < 2 ? 0 : 
    +turf.length(turf.lineString(pts), { units: 'kilometers' }).toFixed(2);
};
export default analyzeGPS;