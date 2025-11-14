async function processCSV(csv,cfg){
 const [{Papa},{groupBy:gb}]=await Promise.all([
  import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.mjs'),
  import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.js')
 ])
 const {filterColumn:fc,filterValue:fv,groupBy:gbk,aggregateColumn:ac,operation:op}=cfg
 const rows=Papa.parse(csv,{header:!0,skipEmptyLines:!0}).data.filter(r=>r&&r[fc]==fv)
 const grouped=gb(rows,r=>r?.[gbk]??'')
 return Object.entries(grouped).map(([k,arr])=>{
  const nums=arr.map(r=>{const n=+r[ac];return Number.isFinite(n)?n:0})
  const sum=nums.reduce((a,b)=>a+b,0)
  const result=op==='sum'?sum:op==='avg'?sum/nums.length:arr.length
  return {[gbk]:k,result}
 })
}
export default processCSV;