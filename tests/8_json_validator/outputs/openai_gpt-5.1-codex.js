const loadAjv = (() => {
  let ajv
  return async () => {
    if (!ajv) {
      const { default: Ajv } = await import('https://cdn.jsdelivr.net/npm/ajv@8.12.0/dist/ajv.js')
      ajv = new Ajv({ allErrors: true, strict: false })
    }
    return ajv
  }
})()

export const validateJSON = async (data, schema) => {
  const ajv = await loadAjv()
  const validate = ajv.compile(schema)
  const valid = validate(data)
  const errors = valid ? [] : validate.errors.map(e => `${e.instancePath || '/'} ${e.message}`)
  return { valid, errors }
}
export default validateJSON;
// Generation time: 6.678s
// Result: FAIL