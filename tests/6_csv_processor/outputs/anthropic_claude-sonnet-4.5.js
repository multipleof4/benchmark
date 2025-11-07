async function processCSV(csvString, config) {
  const { parse } = await import('https://cdn.skypack.dev/papaparse@5.4.1');
  
  const { filterColumn: fc, filterValue: fv, groupBy: gb, aggregateColumn: ac, operation: op } = config;
  
  const { data } = parse(csvString, { header: true, skipEmptyLines: true });
  
  const filtered = data.filter(row => row[fc] == fv);
  
  const grouped = filtered.reduce((acc, row) => {
    const key = row[gb];
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});
  
  return Object.entries(grouped).map(([key, rows]) => {
    let result;
    if (op === 'count') {
      result = rows.length;
    } else {
      const values = rows.map(r => parseFloat(r[ac]) || 0);
      result = op === 'sum' 
        ? values.reduce((a, b) => a + b, 0)
        : values.reduce((a, b) => a + b, 0) / values.length;
    }
    return { [gb]: key, result };
  });
}
export default processCSV;