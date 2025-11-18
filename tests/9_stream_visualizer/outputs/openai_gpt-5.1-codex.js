const createStreamVisualizer=async(iter,o)=>{
  const{maxPoints:m,alpha:a,width:w,height:h,yDomain:Y}=o
  const data=[]
  let ema
  for await(const {timestamp:t,value:v} of iter){
    const d=new Date(t)
    ema=ema==null?v:a*v+(1-a)*ema
    data.push({timestamp:d,value:v,ema})
    if(data.length>m)data.shift()
  }
  if(!data.length)return{data,path:''}
  const{scaleTime,scaleLinear,line}=await import('https://cdn.skypack.dev/d3@7?min')
  const x=scaleTime().domain([data[0].timestamp,data[data.length-1].timestamp]).range([0,w])
  const y=scaleLinear().domain(Y).range([h,0])
  const path=line().x(d=>x(d.timestamp)).y(d=>y(d.ema))(data)||''
  return{data,path}
}
export default createStreamVisualizer;