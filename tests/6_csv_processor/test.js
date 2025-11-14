export default {
  functionName: 'processCSV',
  prompt: `// Write an async JavaScript function 'processCSV' that parses CSV data, filters rows, and performs aggregations.
// - The function must accept a CSV string and a configuration object: { filterColumn: string, filterValue: any, groupBy: string, aggregateColumn: string, operation: 'sum'|'avg'|'count' }.
// - You MUST use dynamic import() to load one or more libraries from a CDN for CSV parsing and data manipulation.
// - Parse the CSV with headers. Filter rows where filterColumn equals filterValue (use loose equality ==).
// - Group filtered rows by the groupBy column value.
// - For each group, perform the operation on the aggregateColumn: 'sum' adds all values, 'avg' calculates mean (sum/count), 'count' returns row count.
// - Convert aggregateColumn values to numbers. Treat non-numeric values as 0.
// - Return an array of objects, one per group: [{ [groupBy]: groupValue, result: aggregatedNumber }].
// - For 'avg', return the exact mathematical average without rounding.`,
  runTest: async (processCSV) => {
    const assert = {
      strictEqual: (a, e, m) => { if (a !== e) throw new Error(m || `FAIL: ${a} !== ${e}`) },
    };
    const csv = `name,department,salary\nAlice,Engineering,90000\nBob,Engineering,85000\nCharlie,Sales,70000\nDiana,Engineering,95000\nEve,Sales,72000`;
    const config = { filterColumn: 'department', filterValue: 'Engineering', groupBy: 'department', aggregateColumn: 'salary', operation: 'avg' };
    const result = await processCSV(csv, config);
    assert.strictEqual(result.length, 1, 'Test Failed: Should return exactly 1 group.');
    const res = result[0];
    assert.strictEqual(res.department, 'Engineering', 'Test Failed: Wrong department.');
    assert.strictEqual(res.result, 90000, 'Test Failed: Average should be exactly 90000.');
  }
};
