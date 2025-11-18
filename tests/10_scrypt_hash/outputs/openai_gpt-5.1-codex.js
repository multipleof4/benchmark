const e=new TextEncoder
const hashPassword=async(p,s)=>{
  const{ scrypt }=await import('https://cdn.skypack.dev/scrypt-js')
  const h=await scrypt(e.encode(p),e.encode(s),1024,8,1,32)
  return Array.from(h,x=>(x+256).toString(16).slice(-2)).join('')
}
export default hashPassword;