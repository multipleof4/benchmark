async function processCSV(csvString, config) {
  const [{ default: Papa }, { groupBy, sumBy, meanBy }] = await Promise.all([
    import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm'),
    import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/+esm')
  ]);

  const data = Papa.parse(csvString, { header: true }).data.filter(row => 
    row[config.filterColumn] == config.filterValue
  );

  const grouped = groupBy(data, config.groupBy);
  
  return Object.entries(grouped).map(([key, rows]) => {
    let result;
    const numRows = rows.map(r => parseFloat(r[config.aggregateColumn]) || 0);
    
    switch(config.operation) {
      case 'sum': result = numRows.reduce((a, b) => a + b, 0); break;
      case 'avg': result = numRows.reduce((a, b) => a + b, 0) / numRows.length; break;
      case 'count': result = numRows.length; break;
    }
    return { [config.groupBy]: key, result };
  });
}
export default processCSV;
// Generation time: 5.258s
// Result: PASS