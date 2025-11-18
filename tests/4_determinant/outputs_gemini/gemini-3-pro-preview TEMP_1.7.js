const calculateDeterminant = async matrix => {
  const { det } = await import('https://esm.sh/mathjs@12');
  return det(matrix);
};
export default calculateDeterminant;