async function findAvailableSlots(a,b,c){
  const f=await import('https://esm.sh/date-fns')
  const p=f.parseISO,d=f.addMinutes,x=f.max,y=f.min,i=f.isBefore,j=f.isAfter
  const {durationMinutes:r,searchRange:s,workHours:w}=c
  const h=t=>t.split(':').map(n=>+n)
  const [ws,we]=[h(w.start),h(w.end)]
  const z=(d0,[H,M])=>{d0=new Date(d0);d0.setHours(H,M,0,0);return d0.toISOString()}
  const S=p(s.start),E=p(s.end)
  let u=[...a,...b].map(o=>({start:p(o.start),end:p(o.end)}))
  u=u.sort((A,B)=>A.start-B.start)
  let m=[]
  for(let k of u){
    if(!m.length||k.start>m[m.length-1].end)m.push({start:k.start,end:k.end})
    else m[m.length-1].end=new Date(Math.max(m[m.length-1].end,k.end))
  }
  let q=[]
  let st=S
  for(let k of m){
    if(i(st,k.start)){
      let fs=x(st,S),fe=y(k.start,E)
      if(i(fs,fe))q.push({start:fs,end:fe})
    }
    st=k.end
  }
  if(i(st,E))q.push({start:x(st,S),end:E})
  let out=[]
  for(let v of q){
    let cs=z(v.start,ws),ce=z(v.start,we)
    cs=p(cs);ce=p(ce)
    let ss=x(v.start,cs),ee=y(v.end,ce)
    for(let t=ss;i(d(t,r),ee)||+d(t,r)==+ee;t=d(t,r)){
      let e=d(t,r)
      if(!j(t,ss)||i(e,ee))out.push({start:t.toISOString(),end:e.toISOString()})
    }
  }
  return out
}
export default findAvailableSlots;