const processCSV = async (csv, c) => {
  const { default: { parse } } = await import('https://esm.sh/papaparse');
  const { data } = parse(csv, { header: true });

  const groups = data.reduce((a, r) => {
    if (r[c.filterColumn] == c.filterValue) {
      const k = r[c.groupBy];
      const v = Number(r[c.aggregateColumn]) || 0;
      if (!a[k]) a[k] = { sum: 0, count: 0 };
      a[k].sum += v;
      a[k].count++;
    }
    return a;
  }, {});

  return Object.entries(groups).map(([k, g]) => ({
    [c.groupBy]: k,
    result: c.operation === 'avg' ? g.sum / g.count :
            c.operation === 'count' ? g.count : g.sum
  }));
};
export default processCSV;
// Generation time: 169.513s
// Result: PASS