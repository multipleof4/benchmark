const store={},load=u=>store[u]??=import(u),csvLib='https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm',dataLib='https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/+esm',toNum=v=>{const n=Number(v);return Number.isFinite(n)?n:0};

async function processCSV(csv,opt){
  const [{Papa},{groupBy:gb}] = await Promise.all([load(csvLib),load(dataLib)]);
  const {filterColumn:f,filterValue:v,groupBy:g,aggregateColumn:a,operation:o}=opt;
  const rows=Papa.parse(csv,{header:true,skipEmptyLines:true}).data.filter(r=>r&&r[f]==v);
  const grouped=gb(rows,r=>r[g]);
  return Object.entries(grouped).map(([k,items])=>{
    const total=items.reduce((s,r)=>s+toNum(r[a]),0);
    const result=o==='count'?items.length:o==='sum'?total:items.length?total/items.length:0;
    return {[g]:k,result};
  });
}
export default processCSV;
// Generation time: 29.916s
// Result: FAIL