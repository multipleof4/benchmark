async function analyzeGPS(readings, boundary) {
  const turf = await import('https://esm.sh/@turf/turf@7.1.0');
  
  const valid = readings.filter(r => 
    turf.booleanPointInPolygon(r.loc, boundary)
  ).sort((a, b) => a.ts - b.ts);
  
  if (valid.length < 2) return 0;
  
  const line = turf.lineString(valid.map(r => r.loc));
  
  return Math.round(turf.length(line) * 100) / 100;
}
export default analyzeGPS;