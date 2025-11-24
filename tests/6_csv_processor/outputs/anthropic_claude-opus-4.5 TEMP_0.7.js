async function processCSV(csv, config) {
  const { filterColumn, filterValue, groupBy, aggregateColumn, operation } = config;
  
  const { default: Papa } = await import('https://cdn.jsdelivr.net/npm/papaparse@5/+esm');
  
  const { data } = Papa.parse(csv, { header: true, skipEmptyLines: true });
  
  const filtered = data.filter(row => row[filterColumn] == filterValue);
  
  const groups = {};
  for (const row of filtered) {
    const key = row[groupBy];
    (groups[key] ??= []).push(row);
  }
  
  const toNum = v => {
    const n = Number(v);
    return isNaN(n) ? 0 : n;
  };
  
  const ops = {
    sum: rows => rows.reduce((s, r) => s + toNum(r[aggregateColumn]), 0),
    avg: rows => rows.length ? ops.sum(rows) / rows.length : 0,
    count: rows => rows.length
  };
  
  return Object.entries(groups).map(([k, v]) => ({
    [groupBy]: k,
    result: ops[operation](v)
  }));
}
export default processCSV;