export async function findLISLength(a){
const{bisectLeft}=await import('https://esm.sh/d3-array');
if(!Array.isArray(a))return 0;
const t=[];
for(const v of a){const i=bisectLeft(t,v);i===t.length?t.push(v):t[i]=v;}
return t.length;
}
export default findLISLength;
// Generation time: 39.477s
// Result: PASS