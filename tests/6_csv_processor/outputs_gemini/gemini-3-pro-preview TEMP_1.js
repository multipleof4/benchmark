export const processCSV = async (csv, { filterColumn: fc, filterValue: fv, groupBy: gb, aggregateColumn: ac, operation: op }) => {
  const { parse } = await import('https://esm.sh/papaparse@5.4.1');
  const { data } = parse(csv, { header: true, skipEmptyLines: true });
  const acc = new Map();

  for (const row of data) {
    if (row[fc] == fv) {
      const key = row[gb];
      const val = +row[ac] || 0;
      const rec = acc.get(key) || { sum: 0, count: 0 };
      rec.sum += val;
      rec.count += 1;
      acc.set(key, rec);
    }
  }

  return Array.from(acc, ([key, { sum, count }]) => ({
    [gb]: key,
    result: op === 'count' ? count : op === 'sum' ? sum : sum / count
  }));
};
export default processCSV;