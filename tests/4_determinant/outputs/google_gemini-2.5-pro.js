const calculateDeterminant = async matrix => {
  const { det } = await import('https://cdn.jsdelivr.net/npm/mathjs@12.4.2/es/index.js');
  return det(matrix);
};
export default calculateDeterminant;