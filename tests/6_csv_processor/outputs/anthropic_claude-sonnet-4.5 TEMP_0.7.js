const processCSV = async (csvString, config) => {
  const { parse } = await import('https://cdn.skypack.dev/papaparse');
  
  const { data } = parse(csvString, { header: true, skipEmptyLines: true });
  
  const filtered = data.filter(row => row[config.filterColumn] == config.filterValue);
  
  const grouped = filtered.reduce((acc, row) => {
    const key = row[config.groupBy];
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});
  
  return Object.entries(grouped).map(([key, rows]) => {
    let result;
    if (config.operation === 'count') {
      result = rows.length;
    } else {
      const values = rows.map(r => parseFloat(r[config.aggregateColumn]) || 0);
      result = config.operation === 'sum' 
        ? values.reduce((a, b) => a + b, 0)
        : values.reduce((a, b) => a + b, 0) / values.length;
    }
    return { [config.groupBy]: key, result };
  });
};
export default processCSV;