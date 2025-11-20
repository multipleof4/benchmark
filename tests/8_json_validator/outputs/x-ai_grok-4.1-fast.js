async function validateJSON(data,schema){
  const{default:Ajv}=await import('https://esm.sh/ajv@7.13.4');
  const ajv=new Ajv({allErrors:true});
  const validate=ajv.compile(schema);
  const valid=validate(data);
  if(valid)return{valid:true,errors:[]};
  const errors=validate.errors.map(e=>`${e.instancePath||''} ${e.message||'Validation error'}`.trim()).filter(Boolean);
  return{valid:false,errors};
}
export default validateJSON;