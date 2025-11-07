let h
const findConvexHull=async v=>{
 const {sortBy,uniqWith,isEqual}=await(h??=import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/+esm'))
 const s=uniqWith(sortBy(v,['x','y']),isEqual)
 if(s.length<3)return s.slice()
 const r=(o,a,b)=>(a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x)
 const l=[]
 for(const p of s){while(l.length>1&&r(l.at(-2),l.at(-1),p)<=0)l.pop();l.push(p)}
 const u=[]
 for(let i=s.length;i--;){const p=s[i];while(u.length>1&&r(u.at(-2),u.at(-1),p)<=0)u.pop();u.push(p)}
 l.pop()
 u.pop()
 return l.concat(u)
}
export default findConvexHull;