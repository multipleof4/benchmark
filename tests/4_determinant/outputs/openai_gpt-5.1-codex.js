const calculateDeterminant=async m=>{
  const {det}=await import('https://cdn.skypack.dev/mathjs')
  return det(m)
}
export default calculateDeterminant;