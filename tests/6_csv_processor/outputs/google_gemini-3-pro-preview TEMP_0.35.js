export const processCSV = async (csvString, { filterColumn, filterValue, groupBy, aggregateColumn, operation }) => {
  const [{ csvParse }, { rollup, sum, mean }] = await Promise.all([
    import('https://esm.sh/d3-dsv'),
    import('https://esm.sh/d3-array')
  ]);

  const getValue = d => +(d[aggregateColumn]) || 0;
  
  const grouped = rollup(
    csvParse(csvString).filter(row => row[filterColumn] == filterValue),
    group => operation === 'count' 
      ? group.length 
      : (operation === 'sum' ? sum : mean)(group, getValue),
    row => row[groupBy]
  );

  return Array.from(grouped, ([key, result]) => ({ [groupBy]: key, result }));
};
export default processCSV;