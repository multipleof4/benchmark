const calculateDeterminant = async m =>
  (await import('https://cdn.jsdelivr.net/npm/mathjs@12/+esm'))
    .det(m)
export default calculateDeterminant;