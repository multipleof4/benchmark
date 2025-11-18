let turf$;
const useTurf = () => turf$ ??= import('https://cdn.skypack.dev/@turf/turf?min');

async function analyzeGPS(readings, boundary) {
  const t = await useTurf();
  const pts = readings
    .filter(r => t.booleanPointInPolygon(t.point(r.loc), boundary))
    .sort((a, b) => a.ts - b.ts);
  if (pts.length < 2) return 0;
  const km = t.length(t.lineString(pts.map(r => r.loc)), { units: 'kilometers' });
  return Math.round(km * 100) / 100;
}
export default analyzeGPS;