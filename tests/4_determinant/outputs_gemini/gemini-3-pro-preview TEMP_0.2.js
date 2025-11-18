const calculateDeterminant = async m =>
  (await import('https://esm.sh/mathjs'))
    .det(m)
export default calculateDeterminant;