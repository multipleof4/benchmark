async function findAvailableSlots(a,b,{durationMinutes:d,searchRange:r,workHours:w}){
const{parseISO:p,formatISO:f,addMinutes:m,min:n,max:x,startOfDay:s}=await import('https://esm.sh/date-fns');
const busy=[...a,...b].map(({start:S,end:E})=>({s:p(S),e:p(E)})).sort((q,y)=>q.s-y.s).reduce((c,{s:S,e:E})=>{
const l=c[c.length-1];if(!l||S>l.e)c.push({s:S,e:E});else l.e=x([l.e,E]);return c;
},[]);
const rs=p(r.start),re=p(r.end),[ws,we]=[w.start,w.end].map(t=>{const[h,m]=t.split(':').map(Number);return h*60+m;});
const free=[];let cur=rs;for(const{s:S,e:E}of busy){S>cur&&free.push({s:cur,e:n([S,re])});cur=x([cur,E]);if(cur>=re)break;}
cur<re&&free.push({s:cur,e:re});const slots=[];for(const{s:fs,e:fe}of free){let st=fs;while(m(st,d)<=fe){const en=m(st,d);const minutes=(st-s(st))/6e4;if(minutes>=ws&&minutes+d<=we)slots.push({start:f(st),end:f(en)});st=en;}}
return slots;
}
export default findAvailableSlots;