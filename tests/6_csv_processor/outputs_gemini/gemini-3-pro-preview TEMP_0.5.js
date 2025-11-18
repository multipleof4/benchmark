const processCSV = async (csvStr, { filterColumn: fCol, filterValue: fVal, groupBy: gBy, aggregateColumn: aggCol, operation: op }) => {
  const { default: Papa } = await import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm')
  const { data } = Papa.parse(csvStr, { header: true, skipEmptyLines: true })
  
  const groups = data.reduce((acc, row) => {
    if (row[fCol] == fVal) {
      const key = row[gBy]
      const val = +row[aggCol] || 0
      acc[key] = acc[key] || { s: 0, c: 0 }
      acc[key].s += val
      acc[key].c++
    }
    return acc
  }, {})

  return Object.entries(groups).map(([key, { s, c }]) => ({
    [gBy]: key,
    result: op === 'count' ? c : op === 'avg' ? s / c : s
  }))
}
export default processCSV;