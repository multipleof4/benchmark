const ajvP=import('https://cdn.skypack.dev/ajv@8?min').then(m=>m.default||m)
const ajvI=ajvP.then(Ajv=>new Ajv({allErrors:true}))
export async function validateJSON(data,schema){
 const ajv=await ajvI
 let validate
 try{validate=ajv.compile(schema)}catch(e){return{valid:false,errors:[e.message]}}
 const valid=validate(data)
 return valid?{valid:true,errors:[]}:{valid:false,errors:validate.errors.map(e=>(e.instancePath||'/')+' '+e.message)}
}
export default validateJSON;