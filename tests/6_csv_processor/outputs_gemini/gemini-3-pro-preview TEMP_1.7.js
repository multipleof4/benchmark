export const processCSV = async (csv, { filterColumn: fc, filterValue: fv, groupBy: gb, aggregateColumn: ac, operation: op }) => {
  const [{ parse }, { groupBy, map }] = await Promise.all([
    import('https://esm.sh/papaparse@5.4.1'),
    import('https://esm.sh/lodash-es@4.17.21')
  ]);

  return map(groupBy(
    parse(csv, { header: true, skipEmptyLines: true }).data.filter(r => r[fc] == fv),
    gb
  ), (rows, key) => {
    const sum = rows.reduce((a, r) => a + (+r[ac] || 0), 0);
    return {
      [gb]: key,
      result: op === 'count' ? rows.length : op === 'avg' ? sum / rows.length : sum
    };
  });
};
export default processCSV;