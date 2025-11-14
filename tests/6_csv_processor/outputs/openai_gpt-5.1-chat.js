async function processCSV(csv, cfg) {
  const p = await import("https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js");
  const f = p.parse(csv, { header: true }).data.filter(r => r[cfg.filterColumn] == cfg.filterValue);
  const g = {};
  for (const r of f) {
    const k = r[cfg.groupBy];
    if (!g[k]) g[k] = [];
    g[k].push(r);
  }
  const out = [];
  for (const k in g) {
    const rows = g[k];
    let nums = rows.map(r => +r[cfg.aggregateColumn] || 0);
    let res = 0;
    if (cfg.operation === "sum") res = nums.reduce((a, b) => a + b, 0);
    else if (cfg.operation === "avg") res = nums.reduce((a, b) => a + b, 0) / nums.length;
    else if (cfg.operation === "count") res = rows.length;
    out.push({ [cfg.groupBy]: k, result: res });
  }
  return out;
}
export default processCSV;