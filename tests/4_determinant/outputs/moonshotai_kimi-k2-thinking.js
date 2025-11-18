const URL = 'https://cdn.jsdelivr.net/npm/mathjs@11.11.0/+esm';
let det;

async function calculateDeterminant(m) {
  const v = Array.isArray(m) && m.length && m.every(r => Array.isArray(r) && r.length === m.length);
  if (!v) throw new TypeError('Invalid matrix');
  
  det ||= await import(URL).then(m => m.det).catch(() => { throw new Error('Load failed'); });
  
  try { return det(m); }
  catch { throw new Error('Calc failed'); }
}
export default calculateDeterminant;