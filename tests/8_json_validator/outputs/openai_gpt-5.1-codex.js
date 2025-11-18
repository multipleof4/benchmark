const fetchAjv=(()=>{let p;return()=>p??=import('https://cdn.jsdelivr.net/npm/ajv@8/dist/ajv.min.js?module').then(({default:A})=>new A({allErrors:true,strict:false}));})();

async function validateJSON(data,schema){
  const ajv=await fetchAjv();
  const validate=ajv.compile(schema);
  const valid=validate(data);
  return {valid,errors:valid?[]:validate.errors.map(e=>e.message||'Invalid')};
}
export default validateJSON;