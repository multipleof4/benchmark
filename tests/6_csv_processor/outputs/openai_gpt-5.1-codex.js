async function processCSV(csv,cfg){
 const[{default:Papa},{groupBy}]=await Promise.all([
  import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm'),
  import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/+esm')
 ]);
 const{filterColumn:f,filterValue:v,groupBy:g,aggregateColumn:a,operation:o}=cfg;
 const rows=Papa.parse(csv,{header:true,skipEmptyLines:true}).data.filter(r=>r[f]==v);
 const groups=groupBy(rows,r=>r[g]);
 return Object.entries(groups).map(([k,list])=>{
  const nums=list.map(r=>{
   const n=Number(r[a]);
   return Number.isFinite(n)?n:0;
  });
  const sum=nums.reduce((t,n)=>t+n,0);
  const count=list.length;
  const result=o==='sum'?sum:o==='avg'?sum/count:count;
  return{[g]:k,result};
 });
}
export default processCSV;