const analyzeGPS = async (readings, boundary) => {
  const { booleanPointInPolygon, point, lineString, length } = await import('https://esm.sh/@turf/turf');
  
  const coords = readings
    .filter(({ loc }) => booleanPointInPolygon(point(loc), boundary, { ignoreBoundary: true }))
    .sort((a, b) => a.ts - b.ts)
    .map(({ loc }) => loc);

  return coords.length < 2 ? 0 : 
    Math.round(length(lineString(coords), { units: 'kilometers' }) * 100) / 100;
};
export default analyzeGPS;