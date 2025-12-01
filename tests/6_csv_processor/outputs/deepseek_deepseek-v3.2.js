async function processCSV(csv, config) {
  const { Papa } = await import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm');
  const { groupBy, sumBy, meanBy } = await import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/+esm');
  
  const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
  const rows = parsed.data.filter(r => r[config.filterColumn] == config.filterValue);
  
  const numericRows = rows.map(r => ({
    ...r,
    [config.aggregateColumn]: Number(r[config.aggregateColumn]) || 0
  }));
  
  const grouped = groupBy(numericRows, config.groupBy);
  const result = Object.entries(grouped).map(([key, group]) => {
    let val;
    if (config.operation === 'sum') {
      val = sumBy(group, config.aggregateColumn);
    } else if (config.operation === 'avg') {
      val = meanBy(group, config.aggregateColumn);
    } else {
      val = group.length;
    }
    return { [config.groupBy]: key, result: val };
  });
  
  return result;
}
export default processCSV;
// Generation time: 10.647s
// Result: FAIL