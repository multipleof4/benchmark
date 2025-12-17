export const processCSV = async (csv, { filterColumn, filterValue, groupBy, aggregateColumn, operation }) => {
  const [{ default: Papa }, { default: _ }] = await Promise.all([
    import('https://cdn.skypack.dev/papaparse'),
    import('https://cdn.skypack.dev/lodash')
  ]);

  const { data } = Papa.parse(csv, {
    header: true,
    skipEmptyLines: 'greedy'
  });

  return _.chain(data)
    .filter(row => row[filterColumn] == filterValue)
    .groupBy(groupBy)
    .map((groupRows, groupKey) => {
      const numbers = groupRows.map(r => Number(r[aggregateColumn]) || 0);
      const sum = _.sum(numbers);
      const result = {
        sum,
        avg: sum / numbers.length,
        count: numbers.length
      }[operation];

      return {
        [groupBy]: groupKey,
        result
      };
    })
    .value();
};
export default processCSV;
// Generation time: 18.916s
// Result: PASS