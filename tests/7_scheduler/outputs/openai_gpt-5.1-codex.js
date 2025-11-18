const useDayjs=(()=>{
 let p
 return()=>p||(p=(async()=>{
  const [{default:d},{default:u}]=await Promise.all([
   import('https://cdn.jsdelivr.net/npm/dayjs@1/esm/index.js'),
   import('https://cdn.jsdelivr.net/npm/dayjs@1/esm/plugin/utc/index.js')
  ])
  d.extend(u)
  return d
 })())
})()

async function findAvailableSlots(c1=[],c2=[],cfg={}){
 const d=await useDayjs()
 const {durationMinutes:dur,searchRange:r={},workHours:w={}}=cfg
 const {start:rs,end:re}=r
 const {start:ws,end:we}=w
 if(!dur||dur<=0||!rs||!re||!ws||!we)return []
 const s=d.utc(rs),e=d.utc(re)
 if(!s.isValid()||!e.isValid()||e.valueOf()<=s.valueOf())return []
 const rangeStart=s.valueOf(),rangeEnd=e.valueOf(),min=60000
 const clip=v=>{
  if(!v||!v.start||!v.end)return 0
  const a=d.utc(v.start),b=d.utc(v.end)
  if(!a.isValid()||!b.isValid())return 0
  const st=Math.max(rangeStart,a.valueOf()),en=Math.min(rangeEnd,b.valueOf())
  return en>st?{start:st,end:en}:0
 }
 const busy=[...c1,...c2].map(clip).filter(Boolean).sort((x,y)=>x.start-y.start)
 const merged=[]
 for(const slot of busy){
  const last=merged[merged.length-1]
  if(!last||slot.start>last.end)merged.push({...slot})
  else if(slot.end>last.end)last.end=slot.end
 }
 const free=[]
 let cur=rangeStart
 for(const slot of merged){
  if(slot.start>cur)free.push({start:cur,end:slot.start})
  cur=Math.max(cur,slot.end)
 }
 if(cur<rangeEnd)free.push({start:cur,end:rangeEnd})
 const minutes=t=>{const [h,m]=t.split(':').map(Number);return h*60+m}
 const workStart=minutes(ws),workEnd=minutes(we)
 if(workStart>=workEnd)return []
 const out=[]
 for(const span of free){
  let day=d.utc(span.start).startOf('day')
  while(day.valueOf()<span.end){
   const dayStart=day.add(workStart,'minute'),dayEnd=day.add(workEnd,'minute')
   const winStart=Math.max(dayStart.valueOf(),span.start),winEnd=Math.min(dayEnd.valueOf(),span.end)
   if(winEnd-winStart>=dur*min){
    let slotStart=d.utc(winStart)
    while(true){
     const slotEnd=slotStart.add(dur,'minute')
     if(slotEnd.valueOf()>winEnd)break
     out.push({start:slotStart.toISOString(),end:slotEnd.toISOString()})
     slotStart=slotEnd
    }
   }
   day=day.add(1,'day')
  }
 }
 return out
}
export default findAvailableSlots;