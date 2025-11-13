export const processCSV=async(csv,cfg)=>{
 const [{parse},{groupBy,sumBy}]=await Promise.all([
  import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm'),
  import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/+esm')
 ]);
 const {filterColumn:fc,filterValue:fv,groupBy:gb,aggregateColumn:ac,operation:op}=cfg;
 const rows=parse(csv,{header:!0,skipEmptyLines:!0}).data.filter(r=>r[fc]==fv);
 const grouped=groupBy(rows,r=>r[gb]);
 const agg=v=>{
  if(op=='count')return v.length;
  const total=sumBy(v,x=>+x[ac]||0);
  return op=='avg'&&v.length?total/v.length:total;
 };
 return Object.entries(grouped).map(([k,v])=>({[gb]:k,result:agg(v)}));
};
export default processCSV;