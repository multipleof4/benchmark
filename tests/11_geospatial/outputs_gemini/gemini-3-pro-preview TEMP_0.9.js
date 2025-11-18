const analyzeGPS = async (readings, boundary) => {
  const { booleanPointInPolygon, point, lineString, length } = await import('https://esm.sh/@turf/turf');

  const coords = readings
    .filter(({ loc }) => booleanPointInPolygon(point(loc), boundary))
    .sort((a, b) => a.ts - b.ts)
    .map(({ loc }) => loc);

  if (coords.length < 2) return 0;

  const total = length(lineString(coords), { units: 'kilometers' });
  return Math.round(total * 100) / 100;
};
export default analyzeGPS;