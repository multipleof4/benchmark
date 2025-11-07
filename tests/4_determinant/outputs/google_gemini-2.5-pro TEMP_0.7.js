const calculateDeterminant = async m => {
  const { det } = await import('https://cdn.jsdelivr.net/npm/mathjs@13.0.0/es/math.mjs');
  return det(m);
};
export default calculateDeterminant;