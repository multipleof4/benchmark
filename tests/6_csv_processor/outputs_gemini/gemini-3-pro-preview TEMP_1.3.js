export const processCSV = async (csv, { filterColumn, filterValue, groupBy, aggregateColumn, operation }) => {
    const [{ parse }, { default: _ }] = await Promise.all([
        import('https://esm.sh/papaparse@5.4.1'),
        import('https://esm.sh/lodash@4.17.21')
    ]);

    const rows = _.filter(parse(csv, { header: true, skipEmptyLines: true }).data, r => r[filterColumn] == filterValue);

    return _.map(_.groupBy(rows, groupBy), (group, key) => {
        const nums = _.map(group, r => {
            const n = parseFloat(r[aggregateColumn]);
            return isNaN(n) ? 0 : n;
        });

        const sum = _.sum(nums);
        const result = operation === 'count' ? group.length :
                       operation === 'sum' ? sum :
                       (sum / (nums.length || 1));

        return { [groupBy]: key, result };
    });
};
export default processCSV;