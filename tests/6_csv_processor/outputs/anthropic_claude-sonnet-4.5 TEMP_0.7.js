async function processCSV(csv, config) {
  const { parse } = await import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm');
  
  const { data } = parse(csv, { header: true, skipEmptyLines: true });
  
  const filtered = data.filter(row => row[config.filterColumn] == config.filterValue);
  
  const groups = filtered.reduce((acc, row) => {
    const key = row[config.groupBy];
    (acc[key] ??= []).push(row);
    return acc;
  }, {});
  
  return Object.entries(groups).map(([key, rows]) => {
    const values = rows.map(r => Number(r[config.aggregateColumn]) || 0);
    const sum = values.reduce((a, b) => a + b, 0);
    
    return {
      [config.groupBy]: key,
      result: config.operation === 'sum' ? sum :
              config.operation === 'avg' ? sum / values.length :
              values.length
    };
  });
}
export default processCSV;
// Generation time: 4.238s
// Result: FAIL