async function processCSV(csv, config) {
  const { parse } = await import('https://cdn.skypack.dev/papaparse@5.4.1');
  
  const { filterColumn: fc, filterValue: fv, groupBy: gb, aggregateColumn: ac, operation: op } = config;
  const { data } = parse(csv, { header: true, skipEmptyLines: true });
  
  const filtered = data.filter(r => r[fc] == fv);
  const grouped = filtered.reduce((acc, row) => {
    const key = row[gb];
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});
  
  return Object.entries(grouped).map(([key, rows]) => {
    const vals = rows.map(r => parseFloat(r[ac]) || 0);
    const result = op === 'sum' 
      ? vals.reduce((a, b) => a + b, 0)
      : op === 'avg'
      ? vals.reduce((a, b) => a + b, 0) / vals.length
      : vals.length;
    
    return { [gb]: key, result };
  });
}
export default processCSV;