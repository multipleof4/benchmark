const processCSV = async (csv, { filterColumn: fc, filterValue: fv, groupBy: gb, aggregateColumn: ac, operation: op }) => {
    const { parse } = (await import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm')).default
    const { data } = parse(csv, { header: true, skipEmptyLines: true })

    return Object.entries(data.reduce((a, r) => {
        if (r[fc] == fv) {
            const k = r[gb], v = +r[ac] || 0
            a[k] ??= { s: 0, c: 0 }
            a[k].s += v
            a[k].c++
        }
        return a
    }, {})).map(([k, { s, c }]) => ({
        [gb]: k,
        result: op === 'count' ? c : op === 'avg' ? s / c : s
    }))
}
export default processCSV;