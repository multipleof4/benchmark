async function validateJSON(data, schema) {
  const {default: Ajv} = await import('https://cdn.jsdelivr.net/npm/ajv@8/dist/ajv.min.js')
  const ajv = new Ajv({allErrors:true, strict:false})
  const validate = ajv.compile(schema)
  const valid = validate(data)
  if (valid) return {valid:true, errors:[]}
  const errors = (validate.errors || []).map(e => {
    const path = (e.instancePath || e.dataPath || '') || (e.schemaPath || '')
    const msg = e.message || 'Invalid value'
    const params = e.params ? JSON.stringify(e.params) : ''
    return [path, msg, params].filter(Boolean).join(' - ')
  })
  return {valid:false, errors}
}
export default validateJSON;