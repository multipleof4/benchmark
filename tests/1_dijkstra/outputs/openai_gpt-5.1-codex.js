export const findShortestPath=async(g,s,e)=>{
 const{default:Q}=await import('https://esm.sh/js-priority-queue')
 const d={},v=new Set(),q=new Q({comparator:(a,b)=>a[1]-b[1]})
 for(const k in g)d[k]=Infinity
 d[s]=0
 q.queue([s,0])
 while(q.length){
  const[n,w]=q.dequeue()
  if(v.has(n))continue
  if(n===e)return w
  v.add(n)
  for(const[nb,c]of Object.entries(g[n]||{})){
   const nw=w+c
   if(nw<d[nb]){
    d[nb]=nw
    q.queue([nb,nw])
   }
  }
 }
 return Infinity
}
export default findShortestPath;
// Generation time: 9.436s
// Result: PASS