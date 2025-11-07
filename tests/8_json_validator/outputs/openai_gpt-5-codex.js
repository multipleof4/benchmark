let ajv
const cache=new WeakMap()
const ensureAjv=async()=>ajv??=new (await import('https://cdn.jsdelivr.net/npm/ajv@8.12.0/+esm')).default({allErrors:true,strict:false})
const getValidator=async schema=>{
  if(cache.has(schema))return cache.get(schema)
  const v=(await ensureAjv()).compile(schema)
  cache.set(schema,v)
  return v
}
async function validateJSON(data,schema){
  try{
    const v=await getValidator(schema)
    const valid=v(data)
    const errors=valid?[]:(v.errors||[]).map(e=>{
      const path=e.instancePath||'/'
      const msg=e.message||'Invalid value'
      const meta=e.params&&Object.keys(e.params).length?` ${JSON.stringify(e.params)}`:''
      return`${path} ${msg}${meta}`.trim()
    })
    return{valid,errors}
  }catch(err){
    return{valid:false,errors:[err?.message||String(err)]}
  }
}
export default validateJSON;