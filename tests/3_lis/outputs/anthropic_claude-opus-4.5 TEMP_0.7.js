async function findLISLength(a) {
  if (!a?.length) return 0;
  const { bisectLeft } = await import('https://cdn.jsdelivr.net/npm/d3-array@3/+esm');
  const t = [];
  for (const n of a) {
    const i = bisectLeft(t, n);
    i < t.length ? t[i] = n : t.push(n);
  }
  return t.length;
}
export default findLISLength;