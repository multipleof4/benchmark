async function calculateDeterminant(m){
  if(!Array.isArray(m)||!m.length||!m.every(r=>Array.isArray(r)&&r.length===m.length))throw new Error('Input must be an n x n matrix');
  const {create,all,det}=await import('https://cdn.jsdelivr.net/npm/mathjs@11.11.0/+esm');
  const math=create(all);
  return math.det(m);
}
export default calculateDeterminant;