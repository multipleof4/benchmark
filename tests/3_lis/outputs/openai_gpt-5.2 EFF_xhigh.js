const d3ArrayUrl = 'https://cdn.jsdelivr.net/npm/d3-array@3/+esm'
const err = 'Expected an array of numbers'
let d3Array

async function findLISLength(nums) {
  if (!Array.isArray(nums)) throw TypeError(err)

  d3Array ||= import(d3ArrayUrl)
  let { bisectLeft } = await d3Array

  let tails = []
  for (let x of nums) {
    if (typeof x != 'number' || x != x) throw TypeError(err)
    tails[bisectLeft(tails, x)] = x
  }
  return tails.length
}
export default findLISLength;
// Generation time: 227.924s
// Result: PASS