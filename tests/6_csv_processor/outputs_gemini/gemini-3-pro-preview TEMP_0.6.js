const processCSV = async (csv, { filterColumn: fc, filterValue: fv, groupBy: gb, aggregateColumn: ac, operation: op }) => {
  const [{ csvParse }, { rollup, sum, mean }] = await Promise.all([
    import('https://esm.sh/d3-dsv@3'),
    import('https://esm.sh/d3-array@3')
  ]);

  return Array.from(
    rollup(
      csvParse(csv).filter(d => d[fc] == fv),
      g => {
        const v = g.map(d => +d[ac] || 0);
        return op === 'count' ? v.length : op === 'sum' ? sum(v) : mean(v);
      },
      d => d[gb]
    ),
    ([k, v]) => ({ [gb]: k, result: v })
  );
};
export default processCSV;