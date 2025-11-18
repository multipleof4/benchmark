const processCSV = async (csvData, { filterColumn, filterValue, groupBy, aggregateColumn, operation }) => {
  const { parse } = await import('https://esm.sh/papaparse');
  const groups = {};

  parse(csvData, { header: true, skipEmptyLines: true }).data.forEach(row => {
    if (row[filterColumn] == filterValue) {
      const key = row[groupBy];
      const val = +row[aggregateColumn] || 0;
      const rec = groups[key] ||= { sum: 0, count: 0 };
      rec.sum += val;
      rec.count++;
    }
  });

  return Object.entries(groups).map(([key, { sum, count }]) => ({
    [groupBy]: key,
    result: operation === 'count' ? count : operation === 'sum' ? sum : sum / count
  }));
};
export default processCSV;