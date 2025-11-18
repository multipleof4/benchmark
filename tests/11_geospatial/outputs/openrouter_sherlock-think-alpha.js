async function analyzeGPS(readings,boundary){
  const{turf}=await import('https://cdn.skypack.dev/@turf/turf');
  const valid=readings
    .filter(({loc})=>turf.booleanPointInPolygon([loc[0],loc[1]],boundary,{ignoreBoundary:true}))
    .sort((a,b)=>a.ts-b.ts);
  return valid.length<2?0:+turf.length(turf.lineString(valid.map(({loc})=>loc)),{units:'kilometers'}).toFixed(2);
}
export default analyzeGPS;