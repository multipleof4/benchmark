let Ajv;
async function validateJSON(json, schema) {
  if(!(json&&typeof json==='object')||!(schema===true||schema===false||(schema&&typeof schema==='object')))
    return{valid:false,errors:['Invalid input']};
  try{
    if(!Ajv){const m=await import('https://esm.sh/ajv@8');Ajv=m.default}
    const ajv=new Ajv({allErrors:true}),v=ajv.compile(schema);
    const valid=v(json);
    return{valid,errors:valid?[]:v.errors.map(e=>`${e.instancePath||'root'} ${e.message}`)};
  }catch(e){return{valid:false,errors:[e.message]}}
}
export default validateJSON;