const calculateDeterminant = async (matrix) => {
  const { det } = await import('https://cdn.jsdelivr.net/npm/mathjs@11.11.0/+esm');
  return det(matrix);
};
export default calculateDeterminant;
