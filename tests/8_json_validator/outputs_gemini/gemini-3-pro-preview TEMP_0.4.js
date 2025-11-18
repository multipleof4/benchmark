const validateJSON = async (data, schema) => {
  try {
    const { default: Ajv } = await import('https://esm.sh/ajv@8.17.1')
    const validate = new Ajv({ allErrors: true }).compile(schema)
    const valid = validate(data)
    return { valid, errors: valid ? [] : validate.errors.map(e => `${e.instancePath} ${e.message}`.trim()) }
  } catch (err) {
    return { valid: false, errors: [err.message] }
  }
}
export default validateJSON;