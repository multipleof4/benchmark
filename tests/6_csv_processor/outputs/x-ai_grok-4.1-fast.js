async function processCSV(csv, config) {
  const [{ default: Papa }, { aq, sum, mean, count }] = await Promise.all([
    import('https://cdn.skypack.dev/papaparse'),
    import('https://cdn.skypack.dev/arquero')
  ]);
  const data = Papa.parse(csv, { header: true, skipEmptyLines: true }).data;
  const { filterColumn, filterValue, groupBy, aggregateColumn, operation } = config;
  let table = aq.from(data).filter(d => d[filterColumn] == filterValue);
  if (operation !== 'count') {
    table = table.derive({ [aggregateColumn]: d => Number(d[aggregateColumn]) || 0 });
  }
  const makeAgg = operation === 'count' ? count() : { sum: sum, avg: mean }[operation](aggregateColumn);
  return table.groupby(groupBy).rollup({ result: makeAgg }).objects();
}
export default processCSV;