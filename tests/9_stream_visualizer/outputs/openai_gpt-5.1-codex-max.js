async function createStreamVisualizer(it,o={}){
 let{maxPoints=100,alpha=.3,width=300,height=150,yDomain:[y0,y1]=[0,1]}=o
 let{scaleLinear,line}=await import('https://cdn.jsdelivr.net/npm/d3@7/+esm')
 let d=[],e
 for await(let{timestamp:t,value:v}of it){
  e=e==null?v:alpha*v+(1-alpha)*e
  d.push({timestamp:+t,value:v,ema:e})
  d.length>maxPoints&&d.shift()
 }
 let p=''
 if(d.length){
  let x=scaleLinear().domain([d[0].timestamp,d.at(-1).timestamp]).range([0,width])
  let y=scaleLinear().domain([y0,y1]).range([height,0])
  p=line().x(a=>x(a.timestamp)).y(a=>y(a.ema))(d)||''
 }
 return{data:d,path:p}
}
export default createStreamVisualizer;
// Generation time: 25.168s
// Result: PASS