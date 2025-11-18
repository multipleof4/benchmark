const processCSV = async (csvStr, { filterColumn: fc, filterValue: fv, groupBy: gb, aggregateColumn: ac, operation: op }) => {
  const { csvParse } = await import('https://esm.sh/d3-dsv@3');
  
  const groups = csvParse(csvStr).reduce((acc, row) => {
    if (row[fc] == fv) {
      const key = row[gb], val = +row[ac] || 0;
      const entry = acc.get(key) || { s: 0, c: 0 };
      entry.s += val;
      entry.c++;
      acc.set(key, entry);
    }
    return acc;
  }, new Map());

  return Array.from(groups, ([key, { s, c }]) => ({
    [gb]: key,
    result: op === 'count' ? c : op === 'sum' ? s : s / c
  }));
};
export default processCSV;