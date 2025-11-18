const processCSV = async (csv, { filterColumn, filterValue, groupBy, aggregateColumn, operation }) => {
  const { parse } = await import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm');
  const groups = {};

  parse(csv, { header: true, skipEmptyLines: true }).data.forEach(row => {
    if (row[filterColumn] == filterValue) {
      const key = row[groupBy];
      const val = +row[aggregateColumn] || 0;
      const acc = groups[key] ??= { sum: 0, count: 0 };
      acc.sum += val;
      acc.count++;
    }
  });

  return Object.entries(groups).map(([key, { sum, count }]) => ({
    [groupBy]: key,
    result: operation === 'count' ? count : operation === 'avg' ? sum / count : sum
  }));
};
export default processCSV;