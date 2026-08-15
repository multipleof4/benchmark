export async function processCSV(csvString, { filterColumn, filterValue, groupBy, aggregateColumn, operation }) {
  const { parse } = await import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm');
  const { data } = parse(csvString, { header: true, skipEmptyLines: true });

  const groups = new Map();

  for (const row of data) {
    if (row[filterColumn] == filterValue) {
      const key = row[groupBy];
      const val = +row[aggregateColumn] || 0;
      const acc = groups.get(key) || { sum: 0, count: 0 };
      acc.sum += val;
      acc.count += 1;
      groups.set(key, acc);
    }
  }

  return Array.from(groups, ([key, { sum, count }]) => ({
    [groupBy]: key,
    result: operation === 'count' ? count : operation === 'avg' ? sum / count : sum
  }));
}
export default processCSV;
// Generation time: 12.695s
// Result: FAIL