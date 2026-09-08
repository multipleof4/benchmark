export async function processCSV(csvString, { filterColumn, filterValue, groupBy, aggregateColumn, operation }) {
  const Papa = (await import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm')).default;
  const { data } = Papa.parse(csvString, { header: true, skipEmptyLines: true });

  const groups = new Map();
  for (const row of data) {
    if (row[filterColumn] == filterValue) {
      const key = row[groupBy];
      const entry = groups.get(key) || { sum: 0, count: 0 };
      entry.sum += Number(row[aggregateColumn]) || 0;
      entry.count++;
      groups.set(key, entry);
    }
  }

  return Array.from(groups, ([key, { sum, count }]) => ({
    [groupBy]: key,
    result: operation === 'count' ? count : operation === 'avg' ? sum / count : sum
  }));
}
export default processCSV;
// Generation time: 82.511s
// Result: PASS