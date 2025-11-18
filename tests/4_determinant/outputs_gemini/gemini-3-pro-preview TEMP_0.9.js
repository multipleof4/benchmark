const calculateDeterminant = async m => {
  const { det } = await import('https://cdn.jsdelivr.net/npm/mathjs@13/+esm')
  return det(m)
}
export default calculateDeterminant;