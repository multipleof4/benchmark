export default{
  functionName:'analyzeGPS',
  prompt:`// Write an async function 'analyzeGPS' that processes GPS data using @turf/turf.
// - Input: 'readings' array [{ts: number, loc: [lon, lat]}], 'boundary' (GeoJSON Polygon).
// - You MUST use dynamic import() to load @turf/turf from a CDN.
// - Filter 'readings' to keep only those where 'loc' is strictly inside 'boundary'.
// - Sort the valid readings by 'ts' ascending.
// - Create a LineString from the sorted locations.
// - Calculate the total length of the path in kilometers using turf.length.
// - Return the length rounded to 2 decimal places (number). Return 0 if < 2 points.`,
  runTest:async(fn)=>{
    const assert=(c,m)=>{if(!c)throw new Error(m)};
    const poly={type:'Polygon',coordinates:[[[0,0],[0,2],[2,2],[2,0],[0,0]]]};
    const pts=[
      {ts:1,loc:[1,0.5]},
      {ts:3,loc:[1,1.5]}, // Dist from (1,0.5) to (1,1.5) is ~111km
      {ts:2,loc:[3,3]}    // Outside
    ];
    const res=await fn(pts,poly);
    assert(typeof res==='number','Result should be a number');
    // 1 deg lat is approx 111.32km
    assert(res>110&&res<112,`Expected ~111.32km, got ${res}`);
    const empty=await fn([],poly);
    assert(empty===0,'Should return 0 for empty input');
  }
};
