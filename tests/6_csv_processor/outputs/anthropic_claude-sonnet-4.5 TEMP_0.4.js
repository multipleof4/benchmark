const processCSV = async (csv, config) => {
  const { parse } = await import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm');
  
  const { data } = parse(csv, { header: true, skipEmptyLines: true });
  
  const filtered = data.filter(row => 
    String(row[config.filterColumn]).trim() === String(config.filterValue).trim()
  );
  
  const grouped = filtered.reduce((acc, row) => {
    const key = row[config.groupBy];
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});
  
  const aggregate = (rows) => {
    const values = rows.map(r => parseFloat(r[config.aggregateColumn]) || 0);
    if (config.operation === 'sum') return values.reduce((a, b) => a + b, 0);
    if (config.operation === 'avg') return values.reduce((a, b) => a + b, 0) / values.length;
    return values.length;
  };
  
  return Object.entries(grouped).map(([key, rows]) => ({
    [config.groupBy]: key,
    result: aggregate(rows)
  }));
};
export default processCSV;