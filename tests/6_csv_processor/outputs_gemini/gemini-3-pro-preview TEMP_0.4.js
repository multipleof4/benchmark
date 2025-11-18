const processCSV = async (csvString, { filterColumn: fc, filterValue: fv, groupBy: gb, aggregateColumn: ac, operation: op }) => {
  const { parse } = await import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm')
  const { data } = parse(csvString, { header: true, skipEmptyLines: true })
  const groups = new Map()

  for (const row of data) {
    if (row[fc] == fv) {
      const key = row[gb]
      const val = +row[ac] || 0
      const acc = groups.get(key) || { sum: 0, count: 0 }
      acc.sum += val
      acc.count += 1
      groups.set(key, acc)
    }
  }

  return Array.from(groups, ([key, { sum, count }]) => ({
    [gb]: key,
    result: op === 'count' ? count : op === 'sum' ? sum : sum / count
  }))
}
export default processCSV;