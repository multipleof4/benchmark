const enc=new TextEncoder()
async function hashPassword(p,s){
  const{default:scrypt}=await import('https://cdn.jsdelivr.net/npm/scrypt-js@3.0.1/+esm')
  const u=await scrypt(enc.encode(p),enc.encode(s),1024,8,1,32)
  return[...u].map(x=>x.toString(16).padStart(2,'0')).join('')
}
export default hashPassword;
// Generation time: 12.207s
// Result: FAIL