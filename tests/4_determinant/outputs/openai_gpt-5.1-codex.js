let d
const calculateDeterminant=async m=> (await (d??=import('https://cdn.jsdelivr.net/npm/mathjs@11.11.0/+esm'))).det(m)
export default calculateDeterminant;