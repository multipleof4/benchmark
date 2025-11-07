async function processCSV(csv, cfg) {
  const {filterColumn,filterValue,groupBy,aggregateColumn,operation} = cfg
  if(!csv||!filterColumn||!groupBy||!operation) throw new Error('Invalid configuration')
  const [{parse},{default:lodash}] = await Promise.all([
    import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm'),
    import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/+esm')
  ])
  const {data,errors} = parse(csv,{header:true,skipEmptyLines:true,dynamicTyping:true})
  if(errors?.length) throw new Error('CSV parse error')
  const rows = data.filter(r=>r[filterColumn]===filterValue)
  if(!rows.length) return []
  const grouped = lodash.groupBy(rows,r=>r[groupBy])
  const out = []
  for(const k in grouped){
    const g = grouped[k]
    let v
    if(operation==='count') v = g.length
    else{
      const nums = g.map(r=>Number(r[aggregateColumn])).filter(n=>Number.isFinite(n))
      if(!nums.length) { v = operation==='sum'?0:null }
      else{
        const s = nums.reduce((a,b)=>a+b,0)
        v = operation==='sum'?s:s/nums.length
      }
    }
    out.push({[groupBy]:k,result:v})
  }
  return out
}
export default processCSV;