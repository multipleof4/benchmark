const processCSV = async (csv, { filterColumn: fc, filterValue: fv, groupBy: gb, aggregateColumn: ac, operation: op }) => {
  const [{ default: Papa }, { default: _ }] = await Promise.all([
    import('https://esm.sh/papaparse@5.4.1'),
    import('https://esm.sh/lodash@4.17.21')
  ])

  const { data } = Papa.parse(csv, { header: true, skipEmptyLines: true })
  
  return _.map(_.groupBy(_.filter(data, r => r[fc] == fv), gb), (rows, k) => {
    const vals = rows.map(r => +r[ac] || 0)
    const sum = _.sum(vals)
    return {
      [gb]: k,
      result: op === 'count' ? vals.length : op === 'sum' ? sum : sum / vals.length
    }
  })
}
export default processCSV;