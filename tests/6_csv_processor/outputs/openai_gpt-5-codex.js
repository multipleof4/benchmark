let cache;
const load=()=>cache||(cache=Promise.all([
  import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.mjs'),
  import('https://cdn.jsdelivr.net/npm/d3-array@3/+esm')
]));
const processCSV=async(csv,cfg)=>{
  const[{default:Papa},{rollup}]=await load();
  const{filterColumn:f,filterValue:v,groupBy:g,aggregateColumn:a,operation:o}=cfg;
  const rows=Papa.parse(csv,{header:1,dynamicTyping:1,skipEmptyLines:1}).data.filter(r=>r[f]===v);
  if(!rows.length)return[];
  const map=rollup(rows,s=>{
    if(o==='count')return s.length;
    const t=s.reduce((p,c)=>p+(Number(c[a])||0),0);
    return o==='avg'?t/s.length:t;
  },r=>r[g]);
  return Array.from(map,([k,val])=>({[g]:k,result:val}));
};
export default processCSV;