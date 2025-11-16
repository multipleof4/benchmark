async function processCSV(csvString,config){
  const{default:Papa}=await import('https://esm.sh/papaparse');
  const{filterColumn:fc,filterValue:fv,groupBy:gb,aggregateColumn:ac,operation:op}=config;
  const parsed=Papa.parse(csvString,{header:true}).data;
  const filtered=parsed.filter(r=>r[fc]==fv);
  const groups=filtered.reduce((acc,r)=>{
    const k=r[gb];
    const v=Number(r[ac])||0;
    if(!acc[k])acc[k]={s:0,c:0};
    acc[k].s+=v;
    acc[k].c++;
    return acc;
  },{});
  return Object.entries(groups).map(([k,g])=>{
    const res=op==='count'?g.c:op==='sum'?g.s:g.s/g.c;
    return{[gb]:k,result:res};
  });
}
export default processCSV;