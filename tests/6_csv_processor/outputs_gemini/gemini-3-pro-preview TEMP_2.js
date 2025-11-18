const processCSV = async (csvString, config) => {
  const [{ csvParse }, { rollups, sum }] = await Promise.all([
    import('https://esm.sh/d3-dsv'),
    import('https://esm.sh/d3-array')
  ]);

  const { filterColumn: fc, filterValue: fv, groupBy: gb, aggregateColumn: ac, operation: op } = config;
  const getVal = d => +d[ac] || 0;

  return rollups(
    csvParse(csvString).filter(d => d[fc] == fv),
    g => op === 'count' ? g.length : (op === 'avg' ? sum(g, getVal) / g.length : sum(g, getVal)),
    d => d[gb]
  ).map(([k, v]) => ({ [gb]: k, result: v }));
};
export default processCSV;