const _csvLibs = (() => {
  let p
  return () =>
    p ??= Promise.all([
      import("https://cdn.jsdelivr.net/npm/d3-dsv@3/+esm"),
      import("https://cdn.jsdelivr.net/npm/d3-array@3/+esm")
    ]).then(([dsv, arr]) => ({ csvParse: dsv.csvParse, group: arr.group }))
})()

async function processCSV(csv, cfg = {}) {
  if (typeof csv != "string") throw new TypeError("csv must be a string")

  const { filterColumn, filterValue, groupBy, aggregateColumn, operation } = cfg
  if (typeof filterColumn != "string" || !filterColumn) throw new TypeError("filterColumn required")
  if (typeof groupBy != "string" || !groupBy) throw new TypeError("groupBy required")
  if (!["sum", "avg", "count"].includes(operation)) throw new TypeError("operation must be sum|avg|count")
  if (operation != "count" && (typeof aggregateColumn != "string" || !aggregateColumn))
    throw new TypeError("aggregateColumn required for sum/avg")

  const { csvParse, group } = await _csvLibs()
  const rows = csvParse(csv)
  const filtered = rows.filter(r => r[filterColumn] == filterValue)
  const groups = group(filtered, r => r[groupBy])

  const num = v => +v || 0
  const calc = rs => {
    const c = rs.length
    if (operation == "count") return c
    const s = rs.reduce((a, r) => a + num(r[aggregateColumn]), 0)
    return operation == "avg" ? s / c : s
  }

  return Array.from(groups, ([k, rs]) => ({ [groupBy]: k, result: calc(rs) }))
}
export default processCSV;
// Generation time: 136.946s
// Result: PASS