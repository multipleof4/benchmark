const processCSV = async (csv, { filterColumn: fCol, filterValue: fVal, groupBy: gBy, aggregateColumn: aCol, operation: op }) => {
  const { csvParse, rollup, sum } = await import('https://cdn.jsdelivr.net/npm/d3@7/+esm')
  
  return Array.from(
    rollup(
      csvParse(csv).filter(r => r[fCol] == fVal),
      g => {
        if (op === 'count') return g.length
        const nums = g.map(r => +r[aCol] || 0), total = sum(nums)
        return op === 'sum' ? total : total / nums.length
      },
      d => d[gBy]
    ),
    ([k, v]) => ({ [gBy]: k, result: v })
  )
}
export default processCSV;