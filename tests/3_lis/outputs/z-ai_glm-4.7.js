async function findLISLength(n) {
  const { bisectLeft } = await import('https://cdn.skypack.dev/d3-array');
  const t = [];
  for (const v of n) {
    const i = bisectLeft(t, v);
    i === t.length ? t.push(v) : t[i] = v;
  }
  return t.length;
}
export default findLISLength;
// Generation time: 41.894s
// Result: PASS