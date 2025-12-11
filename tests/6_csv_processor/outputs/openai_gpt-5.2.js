async function processCSV(csv, cfg) {
  cfg ||= {};
  let {
    filterColumn,
    filterValue,
    groupBy,
    aggregateColumn,
    operation
  } = cfg;

  if (typeof csv != "string" || !groupBy || !operation) return [];

  let [{ default: Papa }, { rollups }] = await Promise.all([
    import("https://esm.sh/papaparse@5.4.1"),
    import("https://esm.sh/d3-array@3.2.4")
  ]);

  let parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
  if (parsed.errors?.length) throw new Error(parsed.errors[0].message || "CSV parse error");

  let rows = parsed.data || [];
  if (filterColumn != null) rows = rows.filter(r => r?.[filterColumn] == filterValue);

  let num = v => {
    v = Number(v);
    return Number.isFinite(v) ? v : 0;
  };

  let agg = op => {
    if (op === "count") return v => v.length;

    let sum = v => {
      let s = 0;
      for (let i = 0; i < v.length; i++) s += num(v[i]?.[aggregateColumn]);
      return s;
    };

    if (op === "avg") return v => v.length ? sum(v) / v.length : 0;
    return v => sum(v);
  };

  let reduce = agg(operation);
  return rollups(rows, reduce, d => d?.[groupBy]).map(([k, result]) => ({ [groupBy]: k, result }));
}
export default processCSV;
// Generation time: 22.087s
// Result: PASS