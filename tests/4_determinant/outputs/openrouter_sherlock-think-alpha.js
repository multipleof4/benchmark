async function calculateDeterminant(matrix) {
  const { det } = await import('https://esm.sh/mathjs');
  return det(matrix);
}
export default calculateDeterminant;