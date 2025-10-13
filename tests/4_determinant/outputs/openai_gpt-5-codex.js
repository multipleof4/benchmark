const src='https://cdn.jsdelivr.net/npm/mathjs@11.11.0/+esm'
export const calculateDeterminant=async m=>{
 if(!Array.isArray(m)||!m.length||m.some(r=>!Array.isArray(r)||r.length!==m.length))throw new TypeError('Matrix must be square')
 const{det}=await import(src)
 return det(m)
}
export default calculateDeterminant;