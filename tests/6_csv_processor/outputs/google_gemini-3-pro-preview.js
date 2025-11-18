const processCSV = async (csv, { filterColumn: fKey, filterValue: fVal, groupBy: gKey, aggregateColumn: aKey, operation: op }) => {
  const { parse } = await import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm')
  const { data } = parse(csv, { header: true, skipEmptyLines: true })
  
  const groups = data.reduce((acc, row) => {
    if (row[fKey] == fVal) {
      const key = row[gKey]
      const val = +row[aKey] || 0
      const rec = acc[key] || { sum: 0, count: 0 }
      rec.sum += val
      rec.count++
      acc[key] = rec
    }
    return acc
  }, {})

  return Object.entries(groups).map(([key, { sum, count }]) => ({
    [gKey]: key,
    result: op === 'count' ? count : op === 'avg' ? sum / count : sum
  }))
}
export default processCSV;