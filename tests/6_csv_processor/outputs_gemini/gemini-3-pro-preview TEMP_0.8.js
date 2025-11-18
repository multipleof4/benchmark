const processCSV = async (csvString, config) => {
    const { parse } = await import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm');
    const { filterColumn: fc, filterValue: fv, groupBy: gb, aggregateColumn: ac, operation: op } = config;
    const acc = {};

    parse(csvString, { header: true, skipEmptyLines: true }).data.forEach(row => {
        if (row[fc] == fv) {
            const key = row[gb];
            const val = +row[ac] || 0;
            const entry = acc[key] ??= { sum: 0, count: 0 };
            entry.sum += val;
            entry.count++;
        }
    });

    return Object.entries(acc).map(([key, { sum, count }]) => ({
        [gb]: key,
        result: op === 'avg' ? sum / count : op === 'count' ? count : sum
    }));
};
export default processCSV;