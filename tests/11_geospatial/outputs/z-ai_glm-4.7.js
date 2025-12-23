async function analyzeGPS(readings, boundary) {
    const t = await import('https://cdn.jsdelivr.net/npm/@turf/turf/+esm');

    const valid = readings
        .filter(r => t.booleanPointInPolygon(t.point(r.loc), boundary))
        .sort((a, b) => a.ts - b.ts);

    if (valid.length < 2) return 0;

    return +(t.length(t.lineString(valid.map(v => v.loc)), { units: 'kilometers' })).toFixed(2);
}
export default analyzeGPS;
// Generation time: 60.849s
// Result: PASS