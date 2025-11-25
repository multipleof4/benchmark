const processCSV = async (csvData, config) => {
  const { parse } = await import('https://cdn.skypack.dev/papaparse@5.3.0')
  const { filterColumn, filterValue, groupBy, aggregateColumn, operation } = config
  const { data } = parse(csvData, { header: true })

  const filtered = data.filter(row => row[filterColumn] == filterValue)
  const groups = filtered.reduce((acc, row) => {
    const key = row[groupBy]
    if (!acc[key]) acc[key] = []
    acc[key].push(row)
    return acc
  }, {})

  return Object.entries(groups).map(([groupValue, rows]) => {
    const numbers = rows.map(row => +row[aggregateColumn] || 0)
    let result

    if (operation === 'sum') result = numbers.reduce((a, b) => a + b, 0)
    if (operation === 'avg') result = numbers.reduce((a, b) => a + b, 0) / numbers.length
    if (operation === 'count') result = numbers.length

    return { [groupBy]: groupValue, result }
  })
}
export default processCSV;