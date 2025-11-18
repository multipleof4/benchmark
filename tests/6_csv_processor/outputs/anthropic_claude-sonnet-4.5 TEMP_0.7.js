const processCSV = async (csv, { filterColumn, filterValue, groupBy, aggregateColumn, operation }) => {
  const [{ default: Papa }] = await Promise.all([
    import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm')
  ]);

  const { data } = Papa.parse(csv, { header: true, skipEmptyLines: true });
  
  const filtered = data.filter(row => row[filterColumn] == filterValue);
  
  const groups = filtered.reduce((acc, row) => {
    const key = row[groupBy];
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});

  return Object.entries(groups).map(([key, rows]) => {
    const values = rows.map(r => Number(r[aggregateColumn]) || 0);
    const sum = values.reduce((a, b) => a + b, 0);
    
    return {
      [groupBy]: key,
      result: operation === 'sum' ? sum : operation === 'avg' ? sum / values.length : values.length
    };
  });
};
export default processCSV;