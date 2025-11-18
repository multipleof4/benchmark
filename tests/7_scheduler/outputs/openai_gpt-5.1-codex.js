async function findAvailableSlots(a,b,c){
 const {DateTime}=await import('https://cdn.skypack.dev/luxon')
 const {durationMinutes:d,searchRange:s,workHours:w}=c
 const r=[DateTime.fromISO(s.start),DateTime.fromISO(s.end)]
 const hm=q=>q.split(':').map(Number)
 const [sh,sm]=hm(w.start)
 const [eh,em]=hm(w.end)
 const clamp=o=>{
  let x=DateTime.fromISO(o.start)
  let y=DateTime.fromISO(o.end)
  if(+y<=+r[0]||+x>=+r[1])return
  if(+x<+r[0])x=r[0]
  if(+y>+r[1])y=r[1]
  if(+y<=+x)return
  return{ s:x,e:y}
 }
 const merged=[]
 ;[...a,...b].map(clamp).filter(Boolean).sort((x,y)=>+x.s-+y.s).forEach(v=>{
  const last=merged.at(-1)
  if(!last||+v.s>+last.e)merged.push({s:v.s,e:v.e})
  else if(+v.e>+last.e)last.e=v.e
 })
 const gaps=[]
 let cur=r[0]
 merged.forEach(v=>{
  if(+v.s>+cur)gaps.push({s:cur,e:v.s})
  if(+v.e>+cur)cur=v.e
 })
 if(+cur<+r[1])gaps.push({s:cur,e:r[1]})
 const slots=[]
 const step={minutes:d}
 gaps.forEach(g=>{
  for(let day=g.s.startOf('day');+day<+g.e;day=day.plus({days:1})){
   const ws=day.set({hour:sh,minute:sm,second:0,millisecond:0})
   const we=day.set({hour:eh,minute:em,second:0,millisecond:0})
   let u=+ws>+g.s?ws:g.s
   const limit=+we<+g.e?we:g.e
   if(+limit<=+u)continue
   for(;+u.plus(step)<=+limit;u=u.plus(step))slots.push({start:u.toISO(),end:u.plus(step).toISO()})
  }
 })
 return slots
}
export default findAvailableSlots;