const validateJSON = async (json, schema) => {
  try {
    const { default: Ajv } = await import('https://esm.sh/ajv@8.12.0')
    const validate = new Ajv({ allErrors: true }).compile(schema)
    const valid = validate(json)
    return {
      valid,
      errors: valid ? [] : validate.errors.map(e => `${e.instancePath} ${e.message}`.trim())
    }
  } catch (error) {
    return { valid: false, errors: [error.message] }
  }
}
export default validateJSON;