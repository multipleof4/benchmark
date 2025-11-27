const processCSV = async (str, { filterColumn: fc, filterValue: fv, groupBy: gb, aggregateColumn: ac, operation: op }) => {
  const { csvParse, rollups, sum } = await import('https://esm.sh/d3@7');
  const num = v => +v || 0;
  return rollups(
    csvParse(str).filter(d => d[fc] == fv),
    g => {
      if (op === 'count') return g.length;
      const t = sum(g, d => num(d[ac]));
      return op === 'sum' ? t : t / g.length;
    },
    d => d[gb]
  ).map(([k, v]) => ({ [gb]: k, result: v }));
};
export default processCSV;
// Generation time: 40.784s
// Result: PASS