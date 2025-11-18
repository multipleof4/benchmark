const processCSV = async (csv, cfg) => {
  const [{default: P}, {default: _}] = await Promise.all([
    import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm'),
    import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm')
  ]);

  const {data} = P.parse(csv, {header: true, skipEmptyLines: true});
  const {filterColumn: fc, filterValue: fv, groupBy: gb, aggregateColumn: ac, operation: op} = cfg;

  return _.map(_.groupBy(_.filter(data, r => r[fc] == fv), gb), (rows, key) => {
    const vals = rows.map(r => +r[ac] || 0), sum = _.sum(vals);
    return {
      [gb]: key,
      result: op === 'count' ? vals.length : op === 'sum' ? sum : sum / vals.length
    };
  });
};
export default processCSV;