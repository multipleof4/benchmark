async function processCSV(csv, { filterColumn: fc, filterValue: fv, groupBy: gb, aggregateColumn: ac, operation: op }) {
  const { default: Papa } = await import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm');
  const groups = {};
  
  Papa.parse(csv, { header: true }).data
    .filter(r => r[fc] == fv)
    .forEach(r => {
      const key = r[gb], g = groups[key] || (groups[key] = { c: 0, s: 0 });
      g.c++;
      g.s += +r[ac] || 0;
    });
  
  return Object.entries(groups).map(([k, { c, s }]) => ({ [gb]: k, result: op === 'count' ? c : op === 'avg' ? s / c : s }));
}
export default processCSV;
// Generation time: 66.769s
// Result: PASS