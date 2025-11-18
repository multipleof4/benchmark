const processCSV = async (csvString, { filterColumn, filterValue, groupBy, aggregateColumn, operation }) => {
    const [{ csvParse }, { rollup, sum, mean }] = await Promise.all([
        import('https://cdn.jsdelivr.net/npm/d3-dsv@3/+esm'),
        import('https://cdn.jsdelivr.net/npm/d3-array@3/+esm')
    ]);

    const getValue = d => +d[aggregateColumn] || 0;
    const data = csvParse(csvString).filter(d => d[filterColumn] == filterValue);
    
    const aggregated = rollup(
        data,
        g => operation === 'count' ? g.length : (operation === 'sum' ? sum : mean)(g, getValue),
        d => d[groupBy]
    );

    return Array.from(aggregated, ([key, result]) => ({ [groupBy]: key, result }));
};
export default processCSV;