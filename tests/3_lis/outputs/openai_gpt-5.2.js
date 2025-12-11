let _d3

async function findLISLength(a) {
  if (!Array.isArray(a)) throw new TypeError("Expected an array of numbers")

  let { bisectLeft: b } = await (_d3 ||= import("https://cdn.jsdelivr.net/npm/d3-array@3/+esm"))
  let t = []

  for (let x of a) t[b(t, x)] = x

  return t.length
}
export default findLISLength;
// Generation time: 9.821s
// Result: PASS