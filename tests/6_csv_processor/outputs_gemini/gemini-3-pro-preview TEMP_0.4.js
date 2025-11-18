const processCSV = async (csv, { filterColumn: fc, filterValue: fv, groupBy: gb, aggregateColumn: ac, operation: op }) => {
  const { csvParse } = await import('https://esm.run/d3-dsv')
  const groups = new Map()

  csvParse(csv).forEach(row => {
    if (row[fc] == fv) {
      const key = row[gb]
      const val = +row[ac] || 0
      const curr = groups.get(key) || { s: 0, n: 0 }
      groups.set(key, { s: curr.s + val, n: curr.n + 1 })
    }
  })

  return [...groups].map(([key, { s, n }]) => ({
    [gb]: key,
    result: op === 'count' ? n : op === 'sum' ? s : s / n
  }))
}
export default processCSV;