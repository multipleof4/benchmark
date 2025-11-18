export const processCSV = async (csv, { filterColumn: fc, filterValue: fv, groupBy: gb, aggregateColumn: ac, operation: op }) => {
  const { csvParse, rollups, sum } = await import('https://cdn.jsdelivr.net/npm/d3@7/+esm')
  
  return rollups(
    csvParse(csv).filter(d => d[fc] == fv),
    g => {
      const s = sum(g, d => +d[ac] || 0)
      return op === 'count' ? g.length : op === 'sum' ? s : s / g.length
    },
    d => d[gb]
  ).map(([k, v]) => ({ [gb]: k, result: v }))
}
export default processCSV;