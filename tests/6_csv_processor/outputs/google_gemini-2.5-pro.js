const processCSV = async (csvString, config) => {
  const {
    filterColumn,
    filterValue,
    groupBy,
    aggregateColumn,
    operation,
  } = config;

  const [Papa, _] = await Promise.all([
    import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm'),
    import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/+esm'),
  ]);

  const aggregators = {
    sum: items => _.sumBy(items, aggregateColumn),
    count: items => items.length,
    avg: items => _.sumBy(items, aggregateColumn) / items.length || 0,
  };

  const { data } = await new Promise(resolve =>
    Papa.parse(csvString, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: resolve,
    })
  );

  const filteredData = data.filter(row => row[filterColumn] === filterValue);
  const groupedData = _.groupBy(filteredData, groupBy);

  return Object.entries(groupedData).map(([key, group]) => ({
    [groupBy]: isNaN(Number(key)) ? key : Number(key),
    result: aggregators[operation](group),
  }));
};
export default processCSV;