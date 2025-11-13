const validateJSON=async(j,s)=>{
  const{default:Ajv}=await import('https://esm.sh/ajv@8')
  const{default:f}=await import('https://esm.sh/ajv-formats@2')
  const a=new Ajv({allErrors:1,strict:false})
  f(a)
  const v=a.compile(s)
  const ok=v(j)
  return{valid:ok,errors:ok?[]:(v.errors||[]).map(e=>`${e.instancePath||'/'} ${e.message}`.trim())}
}
export default validateJSON;