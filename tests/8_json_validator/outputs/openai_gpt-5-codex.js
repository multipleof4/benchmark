let ajvReady
const loadAjv=()=>ajvReady??=(async()=>{
  const {default:Ajv}=await import('https://cdn.jsdelivr.net/npm/ajv@8/dist/ajv2020.mjs')
  return new Ajv({allErrors:true,strict:false})
})()
async function validateJSON(data,schema){
  const ajv=await loadAjv()
  const validate=ajv.compile(schema)
  const valid=validate(data)
  const errors=valid?[]:validate.errors?.map(({instancePath,message,params})=>{
    const here=instancePath||'/'
    const extra=params&&Object.keys(params).length?JSON.stringify(params):''
    return [here,message,extra].filter(Boolean).join(' ')
  })||[]
  return {valid,errors}
}
export default validateJSON;