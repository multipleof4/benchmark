const processCSV = async (csvStr, { filterColumn: fc, filterValue: fv, groupBy: gb, aggregateColumn: ac, operation: op }) => {
  const { parse } = await import('https://esm.sh/papaparse@5.4.1');
  const acc = {};
  
  parse(csvStr, { header: true, skipEmptyLines: true }).data.forEach(row => {
    if (row[fc] == fv) {
      const k = row[gb], v = +row[ac] || 0;
      const curr = acc[k] ||= { s: 0, c: 0 };
      curr.s += v; 
      curr.c++;
    }
  });

  return Object.entries(acc).map(([key, { s, c }]) => ({
    [gb]: key,
    result: op === 'count' ? c : op === 'avg' ? s / c : s
  }));
};
export default processCSV;