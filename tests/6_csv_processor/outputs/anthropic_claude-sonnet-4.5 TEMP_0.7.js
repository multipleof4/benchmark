const processCSV = async (csv, { filterColumn, filterValue, groupBy, aggregateColumn, operation }) => {
  const { default: Papa } = await import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm');
  
  const { data } = Papa.parse(csv, { header: true, skipEmptyLines: true });
  
  const filtered = data.filter(row => row[filterColumn] == filterValue);
  
  const grouped = filtered.reduce((acc, row) => {
    const key = row[groupBy];
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});
  
  return Object.entries(grouped).map(([key, rows]) => {
    let result;
    
    if (operation === 'count') {
      result = rows.length;
    } else {
      const values = rows.map(r => parseFloat(r[aggregateColumn]) || 0);
      result = operation === 'sum' 
        ? values.reduce((a, b) => a + b, 0)
        : values.reduce((a, b) => a + b, 0) / values.length;
    }
    
    return { [groupBy]: key, [operation]: result };
  });
};
export default processCSV;