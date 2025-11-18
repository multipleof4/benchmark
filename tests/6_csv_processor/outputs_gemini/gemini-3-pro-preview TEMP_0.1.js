const processCSV = async (csvString, { filterColumn, filterValue, groupBy, aggregateColumn, operation }) => {
  const { csvParse, rollup, sum, mean } = await import('https://esm.sh/d3@7');
  
  const toNum = d => +d[aggregateColumn] || 0;
  
  const aggregators = {
    sum: g => sum(g, toNum),
    avg: g => mean(g, toNum),
    count: g => g.length
  };

  const data = csvParse(csvString).filter(row => row[filterColumn] == filterValue);
  const grouped = rollup(data, aggregators[operation], d => d[groupBy]);

  return Array.from(grouped, ([key, val]) => ({
    [groupBy]: key,
    result: val
  }));
};
export default processCSV;