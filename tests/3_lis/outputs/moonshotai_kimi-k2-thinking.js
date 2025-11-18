export const findLISLength = async (arr) => {
  if (!Array.isArray(arr) || !arr.length) return 0;
  try {
    const { bisectLeft } = await import('https://cdn.skypack.dev/d3-array@3');
    const t = [];
    for (const v of arr) t[bisectLeft(t, v)] = v;
    return t.length;
  } catch {
    return 0;
  }
};
export default findLISLength;