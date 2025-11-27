async function createStreamVisualizer(iterable,options={}){
  const{maxPoints=100,alpha=.3,width=640,height=320,yDomain=[0,1]}=options
  const{scaleLinear,line}=await import('https://cdn.jsdelivr.net/npm/d3@7/+esm')
  const data=[]
  let ema
  for await(const{timestamp,value}of iterable){
    ema=ema==null?value:alpha*value+(1-alpha)*ema
    data.push({timestamp,value,ema})
    data.length>maxPoints&&data.shift()
  }
  let path=''
  if(data.length){
    const x=scaleLinear().domain([data[0].timestamp,data.at(-1).timestamp]).range([0,width])
    const y=scaleLinear().domain(yDomain).range([height,0])
    path=line().x(d=>x(d.timestamp)).y(d=>y(d.ema))(data)||''
  }
  return{data,path}
}
export default createStreamVisualizer;
// Generation time: 10.093s
// Result: PASS