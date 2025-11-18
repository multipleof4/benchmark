const calculateDeterminant = async m => {
  const { det } = await import('https://esm.sh/mathjs@12')
  return det(m)
}
export default calculateDeterminant;