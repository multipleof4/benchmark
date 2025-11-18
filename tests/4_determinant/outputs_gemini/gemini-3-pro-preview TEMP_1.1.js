const calculateDeterminant = async m => {
  const { det } = await import('https://esm.sh/mathjs@13.0.0')
  return det(m)
}
export default calculateDeterminant;