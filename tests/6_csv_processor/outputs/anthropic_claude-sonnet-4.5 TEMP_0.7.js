const processCSV = async (csvString, { filterColumn, filterValue, groupBy, aggregateColumn, operation }) => {
  const { default: Papa } = await import('https://cdn.jsdelivr.net/npm/[email protected]/+esm');
  
  const { data } = Papa.parse(csvString, { header: true, skipEmptyLines: true });
  
  const filtered = data.filter(row => row[filterColumn] == filterValue);
  
  const groups = filtered.reduce((acc, row) => {
    const key = row[groupBy];
    (acc[key] ??= []).push(row);
    return acc;
  }, {});
  
  return Object.entries(groups).map(([key, rows]) => {
    const values = rows.map(r => +r[aggregateColumn] || 0);
    const sum = values.reduce((a, b) => a + b, 0);
    
    return {
      [groupBy]: key,
      result: operation === 'sum' ? sum : operation === 'avg' ? sum / values.length : rows.length
    };
  });
};
export default processCSV;