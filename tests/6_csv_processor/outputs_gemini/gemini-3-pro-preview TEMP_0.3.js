const processCSV = async (csvString, { filterColumn, filterValue, groupBy, aggregateColumn, operation }) => {
  const [{ default: { parse } }, { rollup, sum, mean }] = await Promise.all([
    import('https://esm.sh/papaparse@5.4.1'),
    import('https://esm.sh/d3-array@3.2.4')
  ]);

  const getNum = row => {
    const val = parseFloat(row[aggregateColumn]);
    return isNaN(val) ? 0 : val;
  };

  const rows = parse(csvString, { header: true, skipEmptyLines: true }).data
    .filter(row => row[filterColumn] == filterValue);

  const grouped = rollup(
    rows,
    group => operation === 'count' ? group.length :
             operation === 'sum' ? sum(group, getNum) :
             mean(group, getNum),
    row => row[groupBy]
  );

  return Array.from(grouped, ([key, result]) => ({ [groupBy]: key, result }));
};
export default processCSV;