let turfReady
const loadTurf=()=>turfReady||(turfReady=import('https://cdn.jsdelivr.net/npm/@turf/turf@6.5.0/+esm'))
async function analyzeGPS(readings,boundary){
  const {point,lineString,length,booleanPointInPolygon}=await loadTurf()
  const inBounds=readings.filter(r=>booleanPointInPolygon(point(r.loc),boundary,{ignoreBoundary:true})).sort((a,b)=>a.ts-b.ts)
  if(inBounds.length<2)return 0
  const km=length(lineString(inBounds.map(r=>r.loc)),{units:'kilometers'})
  return +km.toFixed(2)
}
export default analyzeGPS;
// Generation time: 8.791s
// Result: PASS