async function analyzeGPS(readings,boundary){
  const{booleanPointInPolygon,lineString,length}=await import('https://cdn.skypack.dev/@turf/turf');
  const valid=readings
    .filter(r=>booleanPointInPolygon({type:'Point',coordinates:r.loc},boundary,{ignoreBoundary:true}))
    .sort((a,b)=>a.ts-b.ts);
  return valid.length<2?0:+length(lineString(valid.map(r=>r.loc)),{units:'kilometers'}).toFixed(2);
}
export default analyzeGPS;