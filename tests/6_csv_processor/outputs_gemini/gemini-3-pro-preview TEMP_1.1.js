const processCSV = async (csvString, config) => {
  const { csvParse } = await import('https://esm.sh/d3-dsv@3');
  const { filterColumn: fc, filterValue: fv, groupBy: gb, aggregateColumn: ac, operation: op } = config;

  const groups = csvParse(csvString).reduce((acc, row) => {
    if (row[fc] == fv) {
      const key = row[gb];
      const val = +row[ac] || 0;
      acc[key] = acc[key] || { sum: 0, count: 0 };
      acc[key].sum += val;
      acc[key].count++;
    }
    return acc;
  }, {});

  return Object.entries(groups).map(([key, { sum, count }]) => ({
    [gb]: key,
    result: op === 'avg' ? sum / count : op === 'count' ? count : sum
  }));
};
export default processCSV;