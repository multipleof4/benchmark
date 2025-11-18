const calculateDeterminant = async matrix => {
  const { det } = await import('https://cdn.jsdelivr.net/npm/mathjs/+esm')
  return det(matrix)
}
export default calculateDeterminant;