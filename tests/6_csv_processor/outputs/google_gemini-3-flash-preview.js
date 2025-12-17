export const processCSV = async (csv, { filterColumn, filterValue, groupBy, aggregateColumn, operation }) => {
  const [{ parse }, { groupBy: group, sum: total }] = await Promise.all([
    import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm'),
    import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/+esm')
  ]);

  const { data } = parse(csv, {
    header: true,
    skipEmptyLines: true
  });

  const filtered = data.filter(r => r[filterColumn] == filterValue);
  const collections = group(filtered, groupBy);

  return Object.entries(collections).map(([key, rows]) => {
    const values = rows.map(r => +r[aggregateColumn] || 0);
    const s = total(values);
    const n = values.length;

    const calculations = {
      sum: s,
      avg: s / n,
      count: n
    };

    return {
      [groupBy]: key,
      result: calculations[operation]
    };
  });
};
export default processCSV;
// Generation time: 41.061s
// Result: FAIL