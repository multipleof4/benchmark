async function processCSV(csvString, config) {
  const {
    filterColumn,
    filterValue,
    groupBy,
    aggregateColumn,
    operation,
  } = config;

  const { default: Papa } = await import('https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js');

  const { data } = Papa.parse(csvString, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });

  const aggregators = {
    sum: (acc, val) => (acc || 0) + val,
    count: (acc, _val) => (acc || 0) + 1,
    avg: (acc, val) => {
      const state = acc || { sum: 0, count: 0 };
      state.sum += val;
      state.count += 1;
      return state;
    },
  };

  const groups = data
    .filter(row => row[filterColumn] == filterValue)
    .reduce((acc, row) => {
      const key = row[groupBy];
      acc[key] = aggregators[operation](acc[key], row[aggregateColumn]);
      return acc;
    }, {});

  return Object.entries(groups).map(([key, value]) => ({
    [groupBy]: key,
    result: operation === 'avg'
      ? (value.count ? value.sum / value.count : 0)
      : value,
  }));
}
export default processCSV;