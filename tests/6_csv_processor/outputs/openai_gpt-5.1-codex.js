const libCache={},load=u=>libCache[u]??=import(u);

async function processCSV(csv,cfg){
  const [{csvParse},{groupBy}]=await Promise.all([
    load('https://cdn.jsdelivr.net/npm/d3-dsv@3.0.1/+esm'),
    load('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/+esm')
  ]);
  const {filterColumn:f,filterValue:v,groupBy:k,aggregateColumn:a,operation:o}=cfg;
  const rows=csvParse(csv).filter(r=>r[f]==v);
  const grouped=groupBy(rows,r=>r[k]);
  return Object.entries(grouped).map(([g,list])=>{
    const nums=list.map(r=>{
      const n=+r[a];
      return Number.isFinite(n)?n:0;
    });
    const sum=nums.reduce((s,n)=>s+n,0);
    const result=o==='count'?list.length:o==='sum'?sum:list.length?sum/list.length:0;
    return {[k]:g,result};
  });
}
export default processCSV;