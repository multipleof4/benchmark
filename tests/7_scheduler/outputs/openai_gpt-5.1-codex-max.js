async function findAvailableSlots(a,b,o){
  const {default:d}=await import('https://cdn.jsdelivr.net/npm/dayjs@1.11.10/esm/index.js')
  const {default:u}=await import('https://cdn.jsdelivr.net/npm/dayjs@1.11.10/esm/plugin/utc.js')
  d.extend(u)
  const s=d.utc(o.searchRange.start),e=d.utc(o.searchRange.end)
  const S=s.valueOf(),E=e.valueOf(),t=o.durationMinutes*6e4
  const busy=[...a,...b].map(v=>[d.utc(v.start).valueOf(),d.utc(v.end).valueOf()]).filter(v=>v[1]>S&&v[0]<E).sort((i,j)=>i[0]-j[0])
  const m=[]
  for(const [b0,b1]of busy){
    const x=Math.max(b0,S),y=Math.min(b1,E)
    if(!m.length||x>m[m.length-1][1])m.push([x,y])
    else m[m.length-1][1]=Math.max(m[m.length-1][1],y)
  }
  const r=[],ws=o.workHours.start,we=o.workHours.end
  let j=0
  for(let day=s.startOf('day');day.isBefore(e);day=day.add(1,'day')){
    let w0=d.utc(`${day.format('YYYY-MM-DD')}T${ws}Z`).valueOf(),w1=d.utc(`${day.format('YYYY-MM-DD')}T${we}Z`).valueOf()
    if(w1<=S||w0>=E)continue
    if(w0<S)w0=S
    if(w1>E)w1=E
    if(w0>=w1)continue
    while(j<m.length&&m[j][1]<=w0)j++
    let p=w0
    for(let k=j;k<m.length&&m[k][0]<w1;k++){
      if(m[k][0]>p){
        for(let a=p;a+t<=Math.min(m[k][0],w1);a+=t)r.push({start:new Date(a).toISOString(),end:new Date(a+t).toISOString()})
      }
      p=Math.max(p,m[k][1])
    }
    if(p<w1){
      for(let a=p;a+t<=w1;a+=t)r.push({start:new Date(a).toISOString(),end:new Date(a+t).toISOString()})
    }
  }
  return r
}
export default findAvailableSlots;
// Generation time: 62.189s
// Result: FAIL