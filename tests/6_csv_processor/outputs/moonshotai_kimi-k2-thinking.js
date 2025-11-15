async function processCSV(csv, cfg) {
  const [{ default: Papa }, { default: _ }] = await Promise.all([
    import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm'),
    import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm')
  ]);
  
  const filtered = Papa.parse(csv, { header: true, dynamicTyping: true }).data
    .filter(r => r[cfg.filterColumn] == cfg.filterValue);
  
  return Object.entries(_.groupBy(filtered, cfg.groupBy)).map(([k, v]) => {
    const sum = v.reduce((s, r) => s + (Number(r[cfg.aggregateColumn]) || 0), 0);
    return {
      [cfg.groupBy]: k,
      result: cfg.operation === 'count' ? v.length :
               cfg.operation === 'avg' ? sum / v.length : sum
    };
  });
}
export default processCSV;