async function processCSV(csv, o) {
  const { csvParse } = await import('https://cdn.skypack.dev/d3-dsv');
  const { filterColumn, filterValue, groupBy, aggregateColumn, operation } = o;
  const rows = csvParse(csv);
  const m = new Map();
  for (const r of rows) {
    if (r[filterColumn] == filterValue) {
      const g = r[groupBy];
      let a = +r[aggregateColumn];
      if (isNaN(a)) a = 0;
      const v = m.get(g) || { c: 0, s: 0 };
      v.c++;
      v.s += a;
      m.set(g, v);
    }
  }
  const out = [];
  for (const [k, v] of m) {
    const result = operation === 'sum' ? v.s : operation === 'count' ? v.c : v.s / v.c;
    out.push({ [groupBy]: k, result });
  }
  return out;
}
export default processCSV;
// Generation time: 11.354s
// Result: PASS