async function createStreamVisualizer(iter,opts){
  const{maxPoints:max,alpha,width,height,yDomain}=opts;
  let data=[],prev=null;
  for await(const i of iter){
    const ts=i.timestamp,v=i.value,e=prev==null?v:alpha*v+(1-alpha)*prev;
    prev=e;
    data.push({timestamp:ts,value:v,ema:e});
    if(data.length>max)data.shift();
  }
  const{scaleLinear,line}=await import('https://cdn.skypack.dev/d3');
  if(!data.length)return{data,path:''};
  const x=scaleLinear().domain([data[0].timestamp,data.at(-1).timestamp]).range([0,width]);
  const y=scaleLinear().domain(yDomain).range([height,0]);
  return{data,line().x(d=>x(d.timestamp)).y(d=>y(d.ema))(data)};
}
export default createStreamVisualizer;