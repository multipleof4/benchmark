const calculateDeterminant = async matrix => {
  const { det } = await import('https://cdn.skypack.dev/mathjs')
  return det(matrix)
}
export default calculateDeterminant;