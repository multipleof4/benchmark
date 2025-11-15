let math;
async function calculateDeterminant(m) {
  const n = m?.length;
  if (!n || m.some(r => !Array.isArray(r) || r.length !== n)) throw new Error('Invalid matrix');
  math ||= await import('https://cdn.jsdelivr.net/npm/mathjs@11.11.0/+esm');
  return math.det(m);
}
export default calculateDeterminant;