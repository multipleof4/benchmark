const processCSV = async (csv, { filterColumn: fc, filterValue: fv, groupBy: gb, aggregateColumn: ac, operation: op }) => {
  const { csvParse } = await import('https://esm.sh/d3-dsv@3');
  
  const groups = csvParse(csv).reduce((acc, row) => {
    if (row[fc] == fv) {
      const k = row[gb], v = +row[ac] || 0;
      acc[k] ??= { s: 0, c: 0 };
      acc[k].s += v;
      acc[k].c++;
    }
    return acc;
  }, {});

  return Object.entries(groups).map(([k, { s, c }]) => ({
    [gb]: k,
    result: op === 'count' ? c : op === 'avg' ? s / c : s
  }));
};
export default processCSV;