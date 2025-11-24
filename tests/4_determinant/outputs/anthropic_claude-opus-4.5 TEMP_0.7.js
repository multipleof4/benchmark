async function calculateDeterminant(matrix) {
  const { det } = await import("https://esm.run/mathjs");
  return det(matrix);
}
export default calculateDeterminant;