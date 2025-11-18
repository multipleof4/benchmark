async function analyzeGPS(readings,boundary){
const{booleanPointInPolygon,lineString,length}=await import('https://cdn.jsdelivr.net/npm/@turf/turf@6.5.0/dist/turf.esm.min.js');
const pts=readings.filter(r=>booleanPointInPolygon({type:'Point',coordinates:r.loc},boundary,{ignoreBoundary:true})).sort((a,b)=>a.ts-b.ts);
if(pts.length<2)return 0;
const km=length(lineString(pts.map(r=>r.loc)),{units:'kilometers'});
return Math.round(km*100)/100;
}
export default analyzeGPS;