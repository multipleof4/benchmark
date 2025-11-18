const calculateDeterminant = async m =>
  (await import('https://cdn.jsdelivr.net/npm/mathjs/+esm'))
    .det(m)
export default calculateDeterminant;