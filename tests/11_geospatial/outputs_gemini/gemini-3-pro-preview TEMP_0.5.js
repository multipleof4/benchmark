const analyzeGPS = async (readings, boundary) => {
  const { booleanPointInPolygon, point, lineString, length } = await import('https://esm.sh/@turf/turf');

  const coords = readings
    .filter(({ loc }) => booleanPointInPolygon(point(loc), boundary, { ignoreBoundary: true }))
    .sort((a, b) => a.ts - b.ts)
    .map(({ loc }) => loc);

  return coords.length < 2 
    ? 0 
    : +length(lineString(coords), { units: 'kilometers' }).toFixed(2);
};
export default analyzeGPS;