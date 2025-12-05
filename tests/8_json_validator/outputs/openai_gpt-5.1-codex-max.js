async function validateJSON(d,s){
 const{default:A}=await import('https://cdn.skypack.dev/ajv@8.12.0')
 const a=new A
 const v=a.compile(s)
 const ok=v(d)
 return ok?{valid:!0,errors:[]}:{valid:!1,errors:v.errors.map(e=>(e.instancePath||'root')+' '+e.message)}
}
export default validateJSON;
// Generation time: 4.189s
// Result: PASS