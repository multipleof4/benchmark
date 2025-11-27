const findLISLength = async nums => {
  const { bisectLeft } = await import('https://cdn.jsdelivr.net/npm/d3-array/+esm')
  const tails = []
  
  for (const n of nums) {
    tails[bisectLeft(tails, n)] = n
  }
  
  return tails.length
}
export default findLISLength;
// Generation time: 25.399s
// Result: PASS