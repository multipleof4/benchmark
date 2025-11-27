async function processCSV(csvString, config) {
  const d3 = await import('https://unpkg.com/d3?module');
  const data = d3.csvParse(csvString);
  const filtered = data.filter(row => row[config.filterColumn] == config.filterValue);
  const grouped = d3.group(filtered, d => d[config.groupBy]);
  return [...grouped].map(([key, group]) => {
    const col = config.aggregateColumn;
    const vals = group.map(r => Number(r[col]) || 0);
    let result;
    switch (config.operation) {
      case 'sum': result = vals.reduce((a, b) => a + b, 0); break;
      case 'avg': result = vals.reduce((a, b) => a + b, 0) / vals.length; break;
      case 'count': result = group.length; break;
    }
    return { [config.groupBy]: key, result };
  });
}
export default processCSV;
// Generation time: 34.010s
// Result: PASS