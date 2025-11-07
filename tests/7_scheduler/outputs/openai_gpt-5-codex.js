let cache
const load=()=>cache||(cache=import('https://cdn.skypack.dev/date-fns@2.30.0?min'))
async function findAvailableSlots(calA,calB,rules){
 const {parseISO:iso,addMinutes:plus,differenceInMinutes:gap,eachDayOfInterval:days,set:setTime,max:maxDate,min:minDate}=await load()
 const parseCal=c=>c.map(({start,end})=>({start:iso(start),end:iso(end)}))
 const [sh,sm]=rules.workHours.start.split(':').map(Number)
 const [eh,em]=rules.workHours.end.split(':').map(Number)
 const rangeStart=iso(rules.searchRange.start),rangeEnd=iso(rules.searchRange.end)
 const entries=[...parseCal(calA),...parseCal(calB)].filter(b=>b.end>rangeStart&&b.start<rangeEnd).sort((a,b)=>a.start-b.start)
 const slots=[]
 const addFree=(s,e)=>{
  let cursor=s
  while(gap(e,cursor)>=rules.durationMinutes){
   const stop=plus(cursor,rules.durationMinutes)
   slots.push({start:cursor.toISOString(),end:stop.toISOString()})
   cursor=stop
  }
 }
 for(const day of days({start:rangeStart,end:rangeEnd})){
  const workStart=setTime(day,{hours:sh,minutes:sm,seconds:0,milliseconds:0})
  const workEnd=setTime(day,{hours:eh,minutes:em,seconds:0,milliseconds:0})
  let spanStart=maxDate([workStart,rangeStart]),spanEnd=minDate([workEnd,rangeEnd])
  if(spanStart>=spanEnd)continue
  const busy=entries.filter(b=>b.end>spanStart&&b.start<spanEnd).map(b=>({start:maxDate([b.start,spanStart]),end:minDate([b.end,spanEnd])})).sort((a,b)=>a.start-b.start)
  const merged=[]
  for(const block of busy){
   const last=merged[merged.length-1]
   if(!last||block.start>last.end)merged.push({start:block.start,end:block.end})
   else if(block.end>last.end)last.end=block.end
  }
  let cursor=spanStart
  for(const block of merged){
   if(block.start>cursor)addFree(cursor,block.start)
   if(block.end>cursor)cursor=block.end
  }
  if(cursor<spanEnd)addFree(cursor,spanEnd)
 }
 return slots
}
export default findAvailableSlots;