export default {
  functionName: 'processCSV',
  prompt: `// Write an async JavaScript function 'processCSV' that parses CSV data, filters rows, and performs aggregations.
// - The function must accept a CSV string and a configuration object: { filterColumn: string, filterValue: any, groupBy: string, aggregateColumn: string, operation: 'sum'|'avg'|'count' }.
// - You MUST use dynamic import() to load one or more libraries from a CDN for CSV parsing and data manipulation.
// - Parse the CSV, filter rows where filterColumn equals filterValue, group by groupBy column, and perform the specified aggregation.
// - Return an array of objects with the groupBy value and the aggregated result, e.g. [{ department: 'Engineering', result: 90000 }].`,
  runTest: async (processCSV) => {
    const assert = {
      deepStrictEqual: (a, e, m) => { if (JSON.stringify(a) !== JSON.stringify(e)) throw new Error(m) },
    };
    const csv = `name,department,salary\nAlice,Engineering,90000\nBob,Engineering,85000\nCharlie,Sales,70000\nDiana,Engineering,95000\nEve,Sales,72000`;
    const config = { filterColumn: 'department', filterValue: 'Engineering', groupBy: 'department', aggregateColumn: 'salary', operation: 'avg' };
    const result = await processCSV(csv, config);
    const res = result[0] || {};
    const val = res.result ?? res.avg ?? res.value;
    assert.deepStrictEqual([{ department: res.department, value: val }], [{ department: 'Engineering', value: 90000 }], 'Test Failed: Aggregation incorrect.');
    return result;
  }
};
