export async function processCSV(csvData, config) {
  const { Papa } = await import('https://cdn.skypack.dev/papaparse@5.3.2');
  const { filterColumn, filterValue, groupBy, aggregateColumn, operation } = config;
  
  const { data } = Papa.parse(csvData, { header: true, skipEmptyLines: true });
  
  const groups = data.reduce((acc, row) => {
    if (row[filterColumn] != filterValue) return acc;
    const key = row[groupBy];
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});
  
  return Object.entries(groups).map(([key, rows]) => {
    let result;
    if (operation === 'count') {
      result = rows.length;
    } else {
      const values = rows.map(r => parseFloat(r[aggregateColumn]) || 0);
      if (operation === 'sum') {
        result = values.reduce((a, b) => a + b, 0);
      } else if (operation === 'avg') {
        const sum = values.reduce((a, b) => a + b, 0);
        result = sum / values.length;
      }
    }
    return { [groupBy]: key, result };
  });
}
export default processCSV;
// Generation time: 4.238s
// Result: FAIL