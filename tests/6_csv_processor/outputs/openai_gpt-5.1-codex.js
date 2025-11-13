const libs=(()=>{let c;return()=>c||(c=Promise.all([
import('https://cdn.jsdelivr.net/npm/d3-dsv@3/+esm'),
import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/groupBy.js')
]).then(([dsv,gb])=>({parse:dsv.csvParse,groupBy:gb.default||gb})));})();

const toNum=v=>{const n=+v;return Number.isFinite(n)?n:0};

async function processCSV(csv,opts){
  const {parse,groupBy}=await libs();
  const rows=parse(csv);
  const {filterColumn:fc,filterValue:fv,groupBy:gc,aggregateColumn:ac,operation:op}=opts;
  const pool=groupBy(rows.filter(r=>r[fc]==fv),r=>r[gc]??'');
  const calc={
    sum:x=>x.reduce((t,r)=>t+toNum(r[ac]),0),
    avg:x=>x.length?x.reduce((t,r)=>t+toNum(r[ac]),0)/x.length:0,
    count:x=>x.length
  }[op];
  if(!calc) throw new Error('Unsupported operation');
  return Object.entries(pool).map(([k,x])=>({[gc]:k,result:calc(x)}));
}
export default processCSV;