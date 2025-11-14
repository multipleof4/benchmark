async function validateJSON(d,s){
  const {default:Ajv}=await import('https://cdn.skypack.dev/ajv');
  const a=new Ajv({allErrors:true});
  const v=a.compile(s);
  const ok=v(d);
  return{valid:ok,errors:ok?[]:(v.errors||[]).map(e=>e.message||'')};
}
export default validateJSON;