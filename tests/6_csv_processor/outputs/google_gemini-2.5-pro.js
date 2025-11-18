async function processCSV(csvString, config) {
  const {
    filterColumn,
    filterValue,
    groupBy,
    aggregateColumn,
    operation
  } = config;

  const { default: Papa } = await import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm');

  const { data } = Papa.parse(csvString, {
    header: true,
    skipEmptyLines: true
  });

  const groups = data
    .filter(row => row[filterColumn] == filterValue)
    .reduce((acc, row) => {
      const key = row[groupBy];
      const val = Number(row[aggregateColumn]) || 0;

      if (operation === 'avg') {
        const group = (acc[key] ??= { sum: 0, count: 0 });
        group.sum += val;
        group.count++;
      } else {
        acc[key] = (acc[key] ?? 0) + (operation === 'sum' ? val : 1);
      }
      return acc;
    }, {});

  return Object.entries(groups).map(([groupValue, aggData]) => ({
    [groupBy]: groupValue,
    result: operation === 'avg' ? aggData.sum / aggData.count : aggData,
  }));
}
export default processCSV;