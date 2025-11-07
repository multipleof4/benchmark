let df
async function findAvailableSlots(a,b,c){
  df??=await import('https://cdn.jsdelivr.net/npm/date-fns@3.6.0/+esm')
  const {parseISO:pi,formatISO:fi,eachDayOfInterval:ed,set:st}=df
  const sr=pi(c.searchRange.start),er=pi(c.searchRange.end),srT=+sr,erT=+er
  const [hs,ms]=c.workHours.start.split(':').map(Number)
  const [he,me]=c.workHours.end.split(':').map(Number)
  const step=c.durationMinutes*6e4
  const norm=u=>{
    const arr=u.map(v=>({s:+pi(v.start),e:+pi(v.end)})).filter(v=>v.e>srT&&v.s<erT).map(v=>({s:Math.max(v.s,srT),e:Math.min(v.e,erT)})).filter(v=>v.e>v.s).sort((x,y)=>x.s-y.s)
    const out=[]
    arr.forEach(v=>{
      const w=out[out.length-1]
      if(!w||v.s>w.e)out.push({s:v.s,e:v.e})
      else w.e=Math.max(w.e,v.e)
    })
    return out
  }
  const free=u=>{
    const busy=norm(u),days=ed({start:sr,end:er}),out=[]
    let i=0
    for(const day of days){
      const d0=Math.max(+st(day,{hours:hs,minutes:ms,seconds:0,milliseconds:0}),srT)
      const d1=Math.min(+st(day,{hours:he,minutes:me,seconds:0,milliseconds:0}),erT)
      if(d0>=d1)continue
      while(i<busy.length&&busy[i].e<=d0)i++
      let cur=d0,j=i
      while(j<busy.length&&busy[j].s<d1){
        if(busy[j].s>cur)out.push({s:cur,e:Math.min(busy[j].s,d1)})
        cur=Math.max(cur,busy[j].e)
        if(cur>=d1)break
        j++
      }
      if(cur<d1)out.push({s:cur,e:d1})
      i=j
    }
    return out
  }
  const x=free(a),y=free(b),res=[]
  let i=0,j=0
  while(i<x.length&&j<y.length){
    const s=Math.max(x[i].s,y[j].s)
    const e=Math.min(x[i].e,y[j].e)
    if(e-s>=step){
      const k=Math.floor((e-s)/step)
      for(let n=0;n<k;n++){
        const start=s+n*step,end=start+step
        res.push({start:fi(new Date(start)),end:fi(new Date(end))})
      }
    }
    x[i].e<y[j].e?i++:x[i].e>y[j].e?j++:(i++,j++)
  }
  return res
}
export default findAvailableSlots;