const calculateDeterminant=async m=>{
  const{math}=await import('https://cdn.jsdelivr.net/npm/mathjs@12.4.2/lib/browser/math.js');
  return math.det(m);
};
export default calculateDeterminant;