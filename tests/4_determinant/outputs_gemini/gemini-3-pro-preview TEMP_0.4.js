const calculateDeterminant = async m =>
  (await import('https://esm.sh/mathjs@12'))
    .det(m)
export default calculateDeterminant;