async function calculateDeterminant(m){
  const {det}=await import('https://cdn.jsdelivr.net/npm/mathjs@14.0.0/+esm')
  return det(m)
}
export default calculateDeterminant;