const calculateDeterminant = async matrix => {
  const { create } = await import('https://cdn.jsdelivr.net/npm/mathjs@11.7.0/+esm')
  const math = create()

  if (!Array.isArray(matrix) || !matrix.every(Array.isArray)) {
    throw new TypeError('Input must be an array of arrays')
  }

  if (matrix.length === 0 || matrix.some(row => row.length !== matrix.length)) {
    throw new Error('Matrix must be square (n x n)')
  }

  return math.det(matrix)
}
export default calculateDeterminant;