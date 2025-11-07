let c
const m=()=>c||(c=import('https://cdn.jsdelivr.net/npm/mathjs@11.11.1/+esm'))
async function calculateDeterminant(a){
  const{det}=await m()
  return det(a)
}
export default calculateDeterminant;