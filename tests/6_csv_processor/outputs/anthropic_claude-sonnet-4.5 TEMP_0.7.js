async function processCSV(csvString, config) {
  const { parse } = await import('https://cdn.skypack.dev/papaparse@5.4.1');
  
  const { data } = parse(csvString, { header: true, skipEmptyLines: true });
  
  const filtered = data.filter(row => 
    String(row[config.filterColumn]) === String(config.filterValue)
  );
  
  const grouped = filtered.reduce((acc, row) => {
    const key = row[config.groupBy];
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});
  
  return Object.entries(grouped).map(([key, rows]) => {
    let result;
    const vals = rows.map(r => parseFloat(r[config.aggregateColumn]) || 0);
    
    if (config.operation === 'sum') {
      result = vals.reduce((a, b) => a + b, 0);
    } else if (config.operation === 'avg') {
      result = vals.reduce((a, b) => a + b, 0) / vals.length;
    } else {
      result = rows.length;
    }
    
    return { [config.groupBy]: key, result };
  });
}
export default processCSV;