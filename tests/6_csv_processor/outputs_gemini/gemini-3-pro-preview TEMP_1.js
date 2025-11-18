const processCSV = async (csv, cfg) => {
  const { default: Papa } = await import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm');
  const { filterColumn: fc, filterValue: fv, groupBy: gb, aggregateColumn: ac, operation: op } = cfg;

  const grouped = Papa.parse(csv, { header: true, skipEmptyLines: true }).data.reduce((acc, row) => {
    if (row[fc] == fv) {
      const key = row[gb];
      const val = +row[ac] || 0;
      acc[key] = acc[key] || { sum: 0, count: 0 };
      acc[key].sum += val;
      acc[key].count++;
    }
    return acc;
  }, {});

  return Object.entries(grouped).map(([key, { sum, count }]) => ({
    [gb]: key,
    result: op === 'count' ? count : op === 'avg' ? sum / count : sum
  }));
};
export default processCSV;