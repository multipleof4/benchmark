const lod=import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.js');

export async function findConvexHull(input){
  if(!Array.isArray(input)) return [];
  const {uniqBy:uniq,sortBy:sort}=await lod;
  const pts=sort(uniq(input.filter(p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)).map(p=>({x:+p.x,y:+p.y})),p=>`${p.x}:${p.y}`),['x','y']);
  if(pts.length<2) return pts;
  const area=(a,b,c)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
  const walk=list=>{
    const res=[];
    for(const p of list){
      while(res.length>1&&area(res[res.length-2],res[res.length-1],p)<=0)res.pop();
      res.push(p);
    }
    return res;
  };
  const low=walk(pts);
  const up=walk(pts.slice().reverse());
  const hull=low.slice(0,-1).concat(up.slice(0,-1));
  const out=hull.length?hull:pts.slice(0,2);
  return out.length<3?out:out.reverse();
}
export default findConvexHull;