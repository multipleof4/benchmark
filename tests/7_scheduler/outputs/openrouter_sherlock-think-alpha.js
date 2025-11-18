async function findAvailableSlots(cal1, cal2, {durationMinutes:dm, searchRange, workHours}) {
  const {DateTime:DT, Interval, Duration} = await import('https://cdn.skypack.dev/luxon');
  const dur=Duration.fromObject({minutes:dm});
  const srS=DT.fromISO(searchRange.start).toUTC();
  const srE=DT.fromISO(searchRange.end).toUTC();
  const srI=Interval.fromDateTimes(srS,srE);
  let busies=[...cal1,...cal2].map(s=>{
    const a=DT.fromISO(s.start).toUTC(),b=DT.fromISO(s.end).toUTC();
    return a<b?Interval.fromDateTimes(a,b).intersection(srI):null;
  }).filter(Boolean);
  const [ws,we]=[workHours.start,workHours.end];
  const hms=+ws.slice(0,2),mms=+ws.slice(3,5),hme=+we.slice(0,2),mme=+we.slice(3,5);
  let cur=srS.startOf('day');
  while(cur<srE){
    const dayE=cur.plus({days:1});
    const dayI=Interval.fromDateTimes(cur,dayE).intersection(srI);
    if(dayI.isEmpty) {cur=cur.plus({days:1});continue;}
    const wsT=cur.set({hour:hms,minute:mms,second:0,millisecond:0});
    const weT=cur.set({hour:hme,minute:mme,second:0,millisecond:0});
    const workI=Interval.fromDateTimes(wsT,weT).intersection(dayI);
    if(!workI?.isValid||workI.isEmpty){
      busies.push(dayI);
    }else{
      if(dayI.start<workI.start)busies.push(Interval.fromDateTimes(dayI.start,workI.start));
      if(workI.end<dayI.end)busies.push(Interval.fromDateTimes(workI.end,dayI.end));
    }
    cur=cur.plus({days:1});
  }
  busies.sort((a,b)=>a.start.toMillis()-b.start.toMillis());
  const merged=[];
  for(let iv of busies){
    if(!iv?.isValid||iv.isEmpty)continue;
    if(merged.length===0||merged.at(-1).end<iv.start){
      merged.push(iv);
    }else{
      const last=merged[merged.length-1];
      merged[merged.length-1]=Interval.fromDateTimes(last.start,iv.end>last.end?iv.end:last.end);
    }
  }
  const frees=[];
  let prev=srS;
  for(let b of merged){
    if(prev<b.start)frees.push(Interval.fromDateTimes(prev,b.start));
    prev=b.end>prev?b.end:prev;
  }
  if(prev<srE)frees.push(Interval.fromDateTimes(prev,srE));
  const slots=[];
  for(let f of frees){
    let c=f.start;
    while(c.plus(dur)<=f.end){
      slots.push({start:c.toISO(),end:c.plus(dur).toISO()});
      c=c.plus(dur);
    }
  }
  return slots;
}
export default findAvailableSlots;