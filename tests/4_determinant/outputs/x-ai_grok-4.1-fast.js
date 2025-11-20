async function calculateDeterminant(matrix) {
  const { default: math } = await import('https://cdn.jsdelivr.net/npm/mathjs/lib/browser/math.js');
  return math.det(matrix);
}
export default calculateDeterminant;