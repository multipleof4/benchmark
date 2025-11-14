const processCSV = async (csv, { filterColumn, filterValue, groupBy, aggregateColumn, operation }) => {
  const { parse } = await import('https://cdn.skypack.dev/csv-parse/sync');
  
  const records = parse(csv, { columns: true, skip_empty_lines: true });
  
  const filtered = records.filter(r => r[filterColumn] == filterValue);
  
  const groups = filtered.reduce((acc, row) => {
    const key = row[groupBy];
    (acc[key] ??= []).push(row);
    return acc;
  }, {});
  
  return Object.entries(groups).map(([key, rows]) => {
    const vals = rows.map(r => Number(r[aggregateColumn]) || 0);
    const sum = vals.reduce((a, b) => a + b, 0);
    
    return {
      [groupBy]: key,
      result: operation === 'sum' ? sum : operation === 'avg' ? sum / vals.length : vals.length
    };
  });
};
export default processCSV;