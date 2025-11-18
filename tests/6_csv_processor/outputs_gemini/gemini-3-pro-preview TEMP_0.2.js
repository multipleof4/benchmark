const processCSV = async (csvString, config) => {
  const { default: Papa } = await import('https://esm.sh/papaparse@5.4.1');
  const { filterColumn: fc, filterValue: fv, groupBy: gb, aggregateColumn: ac, operation: op } = config;

  const { data } = Papa.parse(csvString, { header: true, skipEmptyLines: true });

  const groups = data.reduce((acc, row) => {
    if (row[fc] == fv) {
      const key = row[gb];
      const val = +row[ac] || 0;
      
      acc[key] ??= { sum: 0, count: 0 };
      acc[key].sum += val;
      acc[key].count++;
    }
    return acc;
  }, {});

  return Object.entries(groups).map(([key, { sum, count }]) => ({
    [gb]: key,
    result: op === 'count' ? count : op === 'sum' ? sum : sum / count
  }));
};
export default processCSV;