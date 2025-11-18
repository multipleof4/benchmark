const processCSV = async (csv, { filterColumn, filterValue, groupBy, aggregateColumn, operation }) => {
  const { parse } = await import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm');
  const { data } = parse(csv, { header: true, skipEmptyLines: true });

  const groups = data.reduce((acc, row) => {
    if (row[filterColumn] == filterValue) {
      const key = row[groupBy];
      const val = +row[aggregateColumn] || 0;
      acc[key] ||= { sum: 0, count: 0 };
      acc[key].sum += val;
      acc[key].count++;
    }
    return acc;
  }, {});

  return Object.entries(groups).map(([key, { sum, count }]) => ({
    [groupBy]: key,
    result: operation === 'count' ? count : operation === 'sum' ? sum : sum / count
  }));
};
export default processCSV;