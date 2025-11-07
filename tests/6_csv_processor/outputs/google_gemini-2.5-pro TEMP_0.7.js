const processCSV = async (csvString, {
    filterColumn,
    filterValue,
    groupBy,
    aggregateColumn,
    operation
}) => {
    const { default: Papa } = await import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm');

    const aggregations = {
        sum: g => g.s,
        count: g => g.c,
        avg: g => g.c ? g.s / g.c : 0,
    };

    const groupedData = Papa.parse(csvString, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
    }).data
    .filter(row => row[filterColumn] === filterValue)
    .reduce((acc, row) => {
        const key = row[groupBy];
        const val = row[aggregateColumn];

        acc[key] = acc[key] || { s: 0, c: 0 };
        if (typeof val === 'number' && !isNaN(val)) {
            acc[key].s += val;
        }
        acc[key].c++;

        return acc;
    }, {});

    return Object.entries(groupedData).map(([key, group]) => ({
        [groupBy]: /^-?\d+(\.\d+)?$/.test(key) ? Number(key) : key,
        [operation]: aggregations[operation](group),
    }));
};
export default processCSV;