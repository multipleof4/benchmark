const findLISLength = async (nums) => {
  const { bisectLeft: b } = await import('https://esm.sh/d3-array@3');
  const t = [];
  for (const n of nums) t[b(t, n)] = n;
  return t.length;
};
export default findLISLength;