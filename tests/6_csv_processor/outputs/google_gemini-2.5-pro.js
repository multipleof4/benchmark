async function processCSV(csvString, config) {
  const {
    filterColumn: fc,
    filterValue: fv,
    groupBy: gb,
    aggregateColumn: ac,
    operation: op
  } = config;

  const { default: Papa } = await import('https://cdn.jsdelivr.net/npm/papaparse@5.3.2/papaparse.min.js');

  const { data } = Papa.parse(csvString, {
    header: true,
    skipEmptyLines: true
  });

  const groups = data.reduce((acc, row) => {
    if (row[fc] == fv) {
      const key = row[gb];
      const val = Number(row[ac]) || 0;

      acc[key] = acc[key] || { sum: 0, count: 0 };
      acc[key].sum += val;
      acc[key].count++;
    }
    return acc;
  }, {});

  return Object.entries(groups).map(([key, { sum, count }]) => ({
    [gb]: key,
    result: op === 'avg' ? sum / count : op === 'sum' ? sum : count,
  }));
}
export default processCSV;