let cache
const loader=()=>cache??=import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.js')

export const findConvexHull=async pts=>{
 const {sortBy:s,uniqWith:u,isEqual:e}=await loader()
 const data=u(s(pts,[v=>v.x,v=>v.y]),e)
 if(data.length<2)return data.slice()
 const cross=(o,a,b)=>(a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x)
 const lower=[],upper=[]
 for(const p of data){
  while(lower.length>1&&cross(lower.at(-2),lower.at(-1),p)<=0)lower.pop()
  lower.push(p)
 }
 for(let i=data.length;i--;){
  const p=data[i]
  while(upper.length>1&&cross(upper.at(-2),upper.at(-1),p)<=0)upper.pop()
  upper.push(p)
 }
 lower.pop()
 upper.pop()
 return lower.concat(upper)
}
export default findConvexHull;