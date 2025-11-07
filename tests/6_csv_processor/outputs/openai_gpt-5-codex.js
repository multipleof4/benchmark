let cache;
async function processCSV(csv,cfg){
 const {csvParse,rollups}=await (cache??=import('https://cdn.jsdelivr.net/npm/d3@7/+esm'));
 const {filterColumn,filterValue,groupBy,aggregateColumn,operation}=cfg;
 if(!['sum','avg','count'].includes(operation))throw new Error('Unsupported operation');
 if(!csv||!filterColumn||!groupBy)throw new Error('Missing essentials');
 if(operation!=='count'&&!aggregateColumn)throw new Error('Missing aggregateColumn');
 const rows=csvParse(csv).filter(r=>r[filterColumn]==filterValue);
 if(!rows.length)return[];
 const fn=operation==='count'?v=>v.length:v=>{
  let s=0,n=0;
  for(const row of v){
   const val=+row[aggregateColumn];
   if(!Number.isNaN(val)){s+=val;n++;}
  }
  return operation==='sum'?s:n?s/n:0;
 };
 return rollups(rows,fn,r=>r[groupBy]).map(([k,v])=>({[groupBy]:k,[operation]:v}));
}
export default processCSV;