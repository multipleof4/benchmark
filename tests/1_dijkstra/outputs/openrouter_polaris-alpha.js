async function findShortestPath(g,s,e){
  const {default:PriorityQueue} = await import('https://cdn.jsdelivr.net/npm/js-priority-queue@0.1.5/jsprioryqueue.min.js').catch(()=>({default:class{
    constructor(o){this.c=o.comparator||((a,b)=>a-b);this.q=[]}
    queue(v){this.q.push(v);this.q.sort(this.c)}
    dequeue(){return this.q.shift()}
    peek(){return this.q[0]}
    get length(){return this.q.length}
  }}));
  if(!g||!g[s]||!g[e])return Infinity;
  const d={},v={},pq=new PriorityQueue({comparator:(a,b)=>a.w-b.w});
  for(const n in g)d[n]=Infinity;
  d[s]=0;
  pq.queue({n:s,w:0});
  while(pq.length){
    const {n,w}=pq.dequeue();
    if(v[n])continue;
    v[n]=1;
    if(n===e)return w;
    const nb=g[n];
    for(const k in nb){
      const nw=w+nb[k];
      if(nw<d[k]){
        d[k]=nw;
        pq.queue({n:k,w:nw});
      }
    }
  }
  return Infinity;
}
export default findShortestPath;