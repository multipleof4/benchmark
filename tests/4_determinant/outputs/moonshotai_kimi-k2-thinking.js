let mathLib;

async function calculateDeterminant(m) {
  if (!Array.isArray(m) || !m.length || m.some(r => !Array.isArray(r) || r.length !== m.length)) {
    throw new TypeError('Invalid square matrix');
  }
  
  const {det} = await (mathLib ||= import('https://cdn.jsdelivr.net/npm/mathjs@11.11.0/lib/browser/math.js'));
  return det(m);
}
export default calculateDeterminant;