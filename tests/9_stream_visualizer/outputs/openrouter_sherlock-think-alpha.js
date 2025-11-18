async function createStreamVisualizer(iter,opts={}){
  const{maxPoints:mp=1e3,alpha:a=.1,width:w=800,height:h=400,yDomain:yd=[0,1]}=opts;
  let data=[],pE=null;
  for await(const{timestamp:t,value:v}of iter){
    let ema=pE===null?v:a*v+(1-a)*pE;
    pE=ema;
    data.push({timestamp:t,value:v,ema});
    if(data.length>mp)data.shift();
  }
  if(!data.length)return{data,path:null};
  const d3=await import('https://cdn.skypack.dev/d3');
  const x=d3.scaleLinear().domain([data[0].timestamp,data.at(-1).timestamp]).range([0,w]);
  const y=d3.scaleLinear().domain(yd).range([h,0]);
  const ln=d3.line().x(d=>x(d.timestamp)).y(d=>y(d.ema));
  return{data,path:ln(data)};
}
export default createStreamVisualizer;