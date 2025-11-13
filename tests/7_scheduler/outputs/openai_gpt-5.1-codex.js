const luxon=import('https://cdn.skypack.dev/luxon');

const findAvailableSlots=async(c1,c2,k)=>{
  const {DateTime}=await luxon;
  const {durationMinutes:d,searchRange:r,workHours:w}=k;
  const zone=DateTime.fromISO(r.start).zoneName;
  const iso=v=>DateTime.fromISO(v,{zone});
  const rangeStart=iso(r.start);
  const rangeEnd=iso(r.end);
  if(rangeEnd<=rangeStart)return[];
  const [hs,ms]=w.start.split(':').map(Number);
  const [he,me]=w.end.split(':').map(Number);
  const daysEnd=rangeEnd.startOf('day');
  const windows=[];
  for(let day=rangeStart.startOf('day');day<=daysEnd;day=day.plus({days:1})){
    let s=day.set({hour:hs,minute:ms,second:0,millisecond:0});
    let e=day.set({hour:he,minute:me,second:0,millisecond:0});
    if(e<=s||e<=rangeStart||s>=rangeEnd)continue;
    if(s<rangeStart)s=rangeStart;
    if(e>rangeEnd)e=rangeEnd;
    windows.push({start:s,end:e});
  }
  if(!windows.length)return[];
  const busy=[...c1,...c2].map(v=>{
    let s=iso(v.start),e=iso(v.end);
    if(e<=s||e<=rangeStart||s>=rangeEnd)return null;
    if(s<rangeStart)s=rangeStart;
    if(e>rangeEnd)e=rangeEnd;
    return{start:s,end:e};
  }).filter(Boolean).sort((a,b)=>a.start.valueOf()-b.start.valueOf());
  const merged=[];
  for(const slot of busy){
    const last=merged[merged.length-1];
    if(last&&slot.start<=last.end){
      if(slot.end>last.end)last.end=slot.end;
    }else merged.push({start:slot.start,end:slot.end});
  }
  const out=[];
  const push=(s,e)=>e.diff(s,'minutes').minutes>=d&&out.push({start:s.toISO(),end:e.toISO()});
  for(const wSlot of windows){
    let cur=wSlot.start;
    for(const b of merged){
      if(b.start>=wSlot.end)break;
      if(b.end<=wSlot.start)continue;
      const bs=b.start>wSlot.start?b.start:wSlot.start;
      const be=b.end<wSlot.end?b.end:wSlot.end;
      if(bs>cur)push(cur,bs);
      if(be>cur)cur=be;
      if(cur>=wSlot.end)break;
    }
    if(cur<wSlot.end)push(cur,wSlot.end);
  }
  return out;
};
export default findAvailableSlots;