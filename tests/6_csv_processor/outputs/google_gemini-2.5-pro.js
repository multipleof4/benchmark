async function processCSV(csv, {
  filterColumn,
  filterValue,
  groupBy,
  aggregateColumn,
  operation,
}) {
  const { default: Papa } = await import(
    'https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js'
  );

  const { data } = Papa.parse(csv, { header: true, skipEmptyLines: true });

  const groups = data.reduce((acc, row) => {
    if (row[filterColumn] != filterValue) {
      return acc;
    }

    const key = row[groupBy];
    const stats = acc.get(key) || { sum: 0, count: 0 };

    stats.sum += Number(row[aggregateColumn]) || 0;
    stats.count++;

    return acc.set(key, stats);
  }, new Map());

  const aggregators = {
    sum: ({ sum }) => sum,
    avg: ({ sum, count }) => (count ? sum / count : 0),
    count: ({ count }) => count,
  };

  return Array.from(groups, ([key, stats]) => ({
    [groupBy]: key,
    result: aggregators[operation](stats),
  }));
}
export default processCSV;