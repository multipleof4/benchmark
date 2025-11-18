async function processCSV(csv, { filterColumn:f, filterValue:v, groupBy:g, aggregateColumn:a, operation:o }) {
  const [{ default: Papa }, { default: _ }] = await Promise.all([
    import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm'),
    import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm')
  ]);
  
  const data = Papa.parse(csv, { header:true, dynamicTyping:true }).data.filter(r => r[f] == v);
  
  return Object.entries(_.groupBy(data, g)).map(([k, d]) => {
    const n = d.map(r => (x = Number(r[a]), isNaN(x) ? 0 : x));
    const s = n.reduce((p, c) => p + c, 0);
    return { [g]: k, result: o === 'count' ? d.length : o === 'avg' ? s / n.length : s };
  });
}
export default processCSV;