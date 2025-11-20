async function createStreamVisualizer(iter,opts){
  const d3=await import('https://cdn.skypack.dev/d3');
  const {maxPoints=500,alpha=.1,width=800,height=400,yDomain:[0,1]}=opts;
  let data=[],prevEma=null;
  for await(const {timestamp:t,value:v}of iter){
    const ema=prevEma===null?v:alpha*v+(1-alpha)*prevEma;
    prevEma=ema;
    data.push({timestamp:t,value:v,ema});
    if(data.length>maxPoints)data.shift();
  }
  if(data.length<2)return{data,path:"M 0 0"};
  const x0=data[0].timestamp,x1=data.at(-1).timestamp;
  const xScale=d3.scaleLinear().domain([x0,x1]).range([0,width]);
  const yScale=d3.scaleLinear().domain(yDomain).range([height,0]);
  const line=d3.line()
    .x(d=>xScale(d.timestamp))
    .y(d=>yScale(d.ema))
    .curve(d3.curveMonotoneX);
  return{data,path:line(data)};
}
export default createStreamVisualizer;