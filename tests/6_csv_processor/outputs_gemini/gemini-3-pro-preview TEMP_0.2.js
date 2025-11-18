export const processCSV = async (str, { filterColumn: fc, filterValue: fv, groupBy: gb, aggregateColumn: ac, operation: op }) => {
  const [{ parse }, { filter, groupBy, map, sum }] = await Promise.all([
    import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm'),
    import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/+esm')
  ])

  const { data } = parse(str, { header: true, skipEmptyLines: true })
  const rows = filter(data, r => r[fc] == fv)

  return map(groupBy(rows, gb), (group, key) => {
    const vals = map(group, r => +r[ac] || 0)
    const total = sum(vals)
    const res = op === 'count' ? group.length : op === 'sum' ? total : total / group.length
    return { [gb]: key, result: res }
  })
}
export default processCSV;