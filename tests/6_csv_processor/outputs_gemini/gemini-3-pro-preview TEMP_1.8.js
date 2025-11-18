const processCSV = async (csvString, config) => {
  const { filterColumn: key, filterValue: val, groupBy: group, aggregateColumn: target, operation: op } = config
  
  const [dsv, d3] = await Promise.all([
    import('https://esm.sh/d3-dsv'),
    import('https://esm.sh/d3-array')
  ])

  const getVal = d => +d[target] || 0
  const rows = dsv.csvParse(csvString).filter(r => r[key] == val)

  const aggs = d3.rollup(
    rows,
    v => op === 'count' ? v.length : 
         op === 'sum' ? d3.sum(v, getVal) : 
         d3.mean(v, getVal),
    d => d[group]
  )

  return Array.from(aggs, ([gVal, result]) => ({ [group]: gVal, result }))
}
export default processCSV;