export const processCSV = async (str, { 
  filterColumn: fc, 
  filterValue: fv, 
  groupBy: gb, 
  aggregateColumn: ac, 
  operation: op 
}) => {
  const { csvParse, rollups, sum, mean } = await import('https://cdn.jsdelivr.net/npm/d3@7/+esm')
  const val = d => +d[ac] || 0
  
  return rollups(
    csvParse(str).filter(d => d[fc] == fv),
    g => op === 'count' ? g.length : op === 'sum' ? sum(g, val) : mean(g, val) || 0,
    d => d[gb]
  ).map(([k, r]) => ({ [gb]: k, result: r }))
}
export default processCSV;