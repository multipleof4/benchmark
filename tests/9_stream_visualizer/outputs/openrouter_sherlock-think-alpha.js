async function createStreamVisualizer(asyncIterable,options){
  const{maxPoints,alpha,width,height,yDomain}=options;
  const{scaleLinear:sl,line}=await import('https://cdn.skypack.dev/d3');
  let points=[];
  let prevEma=NaN;
  for await(const{timestamp,value}of asyncIterable){
    const ema=isNaN(prevEma)?value:alpha*value+(1-alpha)*prevEma;
    points.push({timestamp,value,ema});
    prevEma=ema;
    if(points.length>maxPoints)points.shift();
  }
  if(!points.length)return{data:[],path:''};
  const xDomain=[points[0].timestamp,points[points.length-1].timestamp];
  const x=sl().domain(xDomain).range([0,width]);
  const y=sl().domain(yDomain).range([height,0]);
  const lineGen=line().x(d=>x(d.timestamp)).y(d=>y(d.ema));
  return{data:points,path:lineGen(points)};
}
export default createStreamVisualizer;