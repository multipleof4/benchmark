const processCSV = async (csv, { filterColumn: fc, filterValue: fv, groupBy: gb, aggregateColumn: ac, operation: op }) => {
  const { default: Papa } = await import('https://esm.sh/papaparse@5.4.1');
  const { data } = Papa.parse(csv, { header: true, skipEmptyLines: true });

  const groups = data.reduce((acc, row) => {
    if (row[fc] == fv) {
      const key = row[gb];
      const val = +row[ac] || 0;
      acc[key] = acc[key] || { s: 0, c: 0 };
      acc[key].s += val;
      acc[key].c++;
    }
    return acc;
  }, {});

  return Object.entries(groups).map(([key, { s, c }]) => ({
    [gb]: key,
    result: op === 'count' ? c : op === 'sum' ? s : s / c
  }));
};
export default processCSV;