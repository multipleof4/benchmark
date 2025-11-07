let l;
const m=()=>l??=import('https://cdn.jsdelivr.net/npm/d3-array@3/+esm').then(({bisectLeft})=>bisectLeft);
export async function findLISLength(a){
 if(!Array.isArray(a)) throw new TypeError('Expected array');
 const b=await m();
 const t=[];
 for(const n of a){
  if(typeof n!=='number'||!Number.isFinite(n)) throw new TypeError('Expected finite numbers');
  const i=b(t,n);
  t[i]=n;
 }
 return t.length;
}
export default findLISLength;