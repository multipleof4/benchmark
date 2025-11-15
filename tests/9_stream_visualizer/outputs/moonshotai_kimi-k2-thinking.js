export async function createStreamVisualizer(i,o){
  const d=await import('d3'),{maxPoints:m,alpha:a,width:w,height:h,yDomain:y}=o,p=[],c=d.scaleLinear,f=d.line;
  let e;
  for await(const{timestamp:t,value:v}of i){e=e===undefined?v:a*v+(1-a)*e;p.push({timestamp:t,value:v,ema:e});p.length>m&&p.shift()}
  if(!p.length)return{data:[],path:''};
  const x=c().domain([p[0].timestamp,p.at(-1).timestamp]).range([0,w]),z=c().domain(y).range([h,0]),g=f().x(d=>x(d.timestamp)).y(d=>z(d.ema)).curve(d.curveLinear);
  return{data:p,path:g(p)}
}
export default createStreamVisualizer;