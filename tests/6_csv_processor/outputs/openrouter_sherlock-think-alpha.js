async function processCSV(csv,config){
  const Papa=(await import('https://cdn.skypack.dev/papaparse')).default;
  const parsed=Papa.parse(csv,{header:!0}).data;
  const{filterColumn:fc,filterValue:fv,groupBy:gb,aggregateColumn:ac,operation:op}=config;
  const filtered=parsed.filter(r=>r[fc]==fv);
  const groups=new Map;
  for(const r of filtered){
    const gv=r[gb];
    const v=Number(r[ac])||0;
    const g=groups.get(gv)||{sum:0,count:0};
    g.sum+=v;
    g.count++;
    groups.set(gv,g);
  }
  return Array.from(groups,(g,gv)=>(({[gb]:gv,result:op==='sum'?g.sum:op==='count'?g.count:g.sum/g.count})));
}
export default processCSV;