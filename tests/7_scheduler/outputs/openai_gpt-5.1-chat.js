async function findAvailableSlots(a,b,c){
  const d=await import('https://esm.sh/date-fns@3.6.0')
  const {parseISO,formatISO,max,min,addMinutes,isBefore}=d
  const p=t=>parseISO(t)
  const wh=(dt,s)=>{
    const [H,M]=s.split(':')
    const x=new Date(dt)
    x.setHours(H,M,0,0)
    return x
  }
  const rng=[p(c.searchRange.start),p(c.searchRange.end)]
  const dur=c.durationMinutes
  const norm=x=>x.map(v=>[p(v.start),p(v.end)])
  const A=norm(a),B=norm(b)
  const merge=x=>{
    let r=x.sort((x,y)=>x[0]-y[0]),o=[r[0]]
    for(let i=1;i<r.length;i++){
      let [s,e]=r[i],l=o[o.length-1]
      if(s<=l[1]) l[1]=new Date(Math.max(e,l[1]))
      else o.push([s,e])
    }
    return o
  }
  const busy=merge(A.concat(B))
  const free=[]
  let cur=rng[0]
  for(let i=0;i<=busy.length;i++){
    let s=i<busy.length?max(cur,busy[i][1]):cur
    let e=i<busy.length?max(cur,busy[i][0]):rng[1]
    if(i<busy.length){
      if(busy[i][0]>cur) free.push([cur,busy[i][0]])
      cur=max(cur,busy[i][1])
    }else free.push([s,e])
  }
  const out=[]
  for(let [s,e]of free){
    s=max(s,rng[0])
    e=min(e,rng[1])
    let ws=wh(s,c.workHours.start)
    let we=wh(s,c.workHours.end)
    if(ws>we){let t=ws;ws=we;we=t}
    let ss=max(s,ws),ee=min(e,we)
    while(isBefore(addMinutes(ss,dur),ee)){
      out.push({start:formatISO(ss),end:formatISO(addMinutes(ss,dur))})
      ss=addMinutes(ss,dur)
    }
  }
  return out
}
export default findAvailableSlots;