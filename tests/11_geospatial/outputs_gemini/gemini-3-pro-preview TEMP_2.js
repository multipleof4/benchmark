const analyzeGPS = async (readings, boundary) => {
  const { booleanPointInPolygon, point, lineString, length } = await import('https://esm.sh/@turf/turf');
  const valid = readings
    .filter(r => booleanPointInPolygon(point(r.loc), boundary))
    .sort((a, b) => a.ts - b.ts);
  
  return valid.length < 2 ? 0 : +length(lineString(valid.map(r => r.loc))).toFixed(2);
};
export default analyzeGPS;