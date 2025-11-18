const analyzeGPS = async (readings, boundary) => {
  const turf = await import('https://esm.sh/@turf/turf@7.1.0');
  
  const validReadings = readings
    .filter(r => turf.booleanPointInPolygon(turf.point(r.loc), boundary))
    .sort((a, b) => a.ts - b.ts);
  
  if (validReadings.length < 2) return 0;
  
  const lineString = turf.lineString(validReadings.map(r => r.loc));
  
  return Math.round(turf.length(lineString) * 100) / 100;
};
export default analyzeGPS;