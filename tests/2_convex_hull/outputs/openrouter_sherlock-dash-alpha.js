async function findConvexHull(points) {
  const {_, default: _} = await import('https://cdn.skypack.dev/lodash-es');
  const pts = _([...new Set(points.map(p=>`${p.x},${p.y}`))].map(s=>s.split(',').map(Number)).map(([x,y])=>({x,y})));
  const ccw=(a,b,c)=> (b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
  const build=(pts,low)=> {
    const hull=[];
    for(let p of pts){
      while(hull.length>1&&ccw(hull[hull.length-2],hull[hull.length-1],p)<=0) hull.pop();
      hull.push(p);
    }
    return hull.slice(0,low?hull.length:hull.length-1);
  };
  if(pts.length<3) return pts;
  return [...build(pts.sort((a,b)=>a.x-b.x||a.y-b.y),1),...build(pts.slice().reverse(),0)];
}
export default findConvexHull;