async function processCSV(csv, c) {
  if (typeof csv !== 'string') throw new TypeError('csv must be string')
  if (!c || typeof c !== 'object') throw new TypeError('config required')
  let { filterColumn, filterValue, groupBy, aggregateColumn, operation } = c
  if (!filterColumn || !groupBy || !operation) throw new Error('missing config')
  if (!['sum', 'avg', 'count'].includes(operation)) throw new Error('bad op')

  const { parse } = await import('https://cdn.skypack.dev/papaparse@5.4.1')
  const _ = (await import('https://cdn.skypack.dev/lodash-es@4.17.21')).default

  const { data, errors } = parse(csv, { header: true, dynamicTyping: true, skipEmptyLines: true })
  if (errors && errors.length) throw new Error('csv parse error')

  const rows = _.filter(data, r => r && r[filterColumn] === filterValue)
  if (!rows.length) return []

  const grouped = _.groupBy(rows, r => r[groupBy])
  const out = []

  _.forOwn(grouped, (items, k) => {
    let result
    if (operation === 'count') {
      result = items.length
    } else {
      const nums = _.map(items, i => Number(i[aggregateColumn])).filter(v => Number.isFinite(v))
      if (!nums.length) return
      const sum = _.sum(nums)
      result = operation === 'sum' ? sum : sum / nums.length
    }
    out.push({ [groupBy]: k, result })
  })

  return out
}
export default processCSV;