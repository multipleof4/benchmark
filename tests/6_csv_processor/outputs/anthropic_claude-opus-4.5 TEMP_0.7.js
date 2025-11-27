async function processCSV(csv, config) {
  const { parse } = await import('https://cdn.jsdelivr.net/npm/papaparse@5/+esm');
  const { filterColumn, filterValue, groupBy, aggregateColumn, operation } = config;
  
  const { data } = parse(csv, { header: true, skipEmptyLines: true });
  
  const filtered = data.filter(row => row[filterColumn] == filterValue);
  
  const groups = {};
  for (const row of filtered) {
    const key = row[groupBy];
    (groups[key] ??= []).push(+row[aggregateColumn] || 0);
  }
  
  return Object.entries(groups).map(([key, vals]) => ({
    [groupBy]: key,
    result: operation === 'count' ? vals.length :
            operation === 'sum' ? vals.reduce((a, b) => a + b, 0) :
            vals.reduce((a, b) => a + b, 0) / vals.length
  }));
}
export default processCSV;
// Generation time: 4.406s
// Result: FAIL