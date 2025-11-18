const findLISLength = async (nums) => {
  const { bisectLeft } = await import('https://esm.sh/d3-array')
  const tails = []
  
  for (const x of nums) {
    tails[bisectLeft(tails, x)] = x
  }
  
  return tails.length
}
export default findLISLength;