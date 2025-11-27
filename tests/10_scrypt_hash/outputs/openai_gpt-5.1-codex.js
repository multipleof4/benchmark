const hashPassword=async(p,s)=>{
  const {scrypt}=await import('https://cdn.skypack.dev/scrypt-js')
  const e=new TextEncoder
  const h=await scrypt(e.encode(p),e.encode(s),1024,8,1,32)
  return [...h].map(b=>b.toString(16).padStart(2,'0')).join('')
}
export default hashPassword;
// Generation time: 8.405s
// Result: PASS