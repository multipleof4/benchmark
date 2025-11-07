async function processCSV(csv, config) {
  const { parse } = await import('https://esm.sh/papaparse@5.4.1');
  const { groupBy, sumBy, meanBy, countBy } = await import('https://esm.sh/lodash-es@4.17.21');
  
  const { data } = parse(csv, { header: true, skipEmptyLines: true });
  
  const filtered = data.filter(row => 
    String(row[config.filterColumn]) === String(config.filterValue)
  );
  
  const grouped = Object.entries(
    groupBy(filtered, config.groupBy)
  );
  
  const ops = {
    sum: arr => sumBy(arr, r => parseFloat(r[config.aggregateColumn]) || 0),
    avg: arr => meanBy(arr, r => parseFloat(r[config.aggregateColumn]) || 0),
    count: arr => arr.length
  };
  
  return grouped.map(([key, rows]) => ({
    [config.groupBy]: key,
    result: ops[config.operation](rows)
  }));
}
export default processCSV;