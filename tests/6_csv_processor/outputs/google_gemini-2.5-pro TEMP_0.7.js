const processCSV = async (
  csvString, {
    filterColumn,
    filterValue,
    groupBy,
    aggregateColumn,
    operation
  }
) => {
  const [Papa, {
    default: _
  }] = await Promise.all([
    import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js'),
    import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/+esm'),
  ]);

  const {
    data
  } = Papa.parse(csvString, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });

  const aggregators = {
    sum: g => _.sumBy(g, aggregateColumn),
    avg: g => _.meanBy(g, aggregateColumn),
    count: g => g.length,
  };

  return _.chain(data)
    .filter({
      [filterColumn]: filterValue
    })
    .groupBy(groupBy)
    .map((rows, key) => ({
      [groupBy]: Number.isNaN(+key) ? key : +key,
      result: aggregators[operation](rows),
    }))
    .value();
};
export default processCSV;