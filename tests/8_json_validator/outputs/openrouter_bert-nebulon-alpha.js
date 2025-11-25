const validateJSON = async (json, schema) => {
  try {
    const { default: Ajv } = await import('https://cdn.jsdelivr.net/npm/ajv@8.12.0/+esm')
    const { default: addFormats } = await import('https://cdn.jsdelivr.net/npm/ajv-formats@2.1.1/+esm')

    const ajv = new Ajv({
      allErrors: true,
      strict: false,
      validateSchema: true
    })

    addFormats(ajv)

    const validate = ajv.compile(schema)
    const valid = validate(json)

    return {
      valid,
      errors: valid ? [] : validate.errors.map(err => ({
        message: err.message,
        instancePath: err.instancePath,
        schemaPath: err.schemaPath,
        params: err.params
      }))
    }
  } catch (error) {
    return {
      valid: false,
      errors: [{
        message: error.message,
        stack: error.stack
      }]
    }
  }
}
export default validateJSON;