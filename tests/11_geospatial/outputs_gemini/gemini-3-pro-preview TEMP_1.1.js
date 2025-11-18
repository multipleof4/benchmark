const analyzeGPS = async (readings, boundary) => {
  const turf = await import('https://esm.sh/@turf/turf');
  const coords = readings
    .filter(({ loc }) => turf.booleanPointInPolygon(turf.point(loc), boundary))
    .sort((a, b) => a.ts - b.ts)
    .map(r => r.loc);

  return coords.length < 2 ? 0 :
    Math.round(turf.length(turf.lineString(coords), { units: 'kilometers' }) * 100) / 100;
};
export default analyzeGPS;