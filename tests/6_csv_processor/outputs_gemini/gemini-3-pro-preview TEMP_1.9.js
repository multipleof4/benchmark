const processCSV = async (csv, { filterColumn: fCol, filterValue: fVal, groupBy: gBy, aggregateColumn: aggCol, operation: op }) => {
  const { parse } = await import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm')
  const groups = new Map()
  
  parse(csv, { header: true, skipEmptyLines: true }).data.forEach(row => {
    if (row[fCol] == fVal) {
      const key = row[gBy], val = +row[aggCol] || 0
      const cur = groups.get(key) || { sum: 0, count: 0 }
      groups.set(key, { sum: cur.sum + val, count: cur.count + 1 })
    }
  })

  return Array.from(groups, ([key, { sum, count }]) => ({
    [gBy]: key,
    result: op === 'avg' ? sum / count : op === 'count' ? count : sum
  }))
}
export default processCSV;