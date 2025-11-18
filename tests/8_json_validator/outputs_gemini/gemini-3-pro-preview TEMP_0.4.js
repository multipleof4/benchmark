const validateJSON = async (data, schema) => {
  const { default: Ajv } = await import('https://esm.sh/ajv@8.17.1')
  const validate = new Ajv({ allErrors: !0 }).compile(schema)
  const valid = validate(data)
  return { valid, errors: valid ? [] : validate.errors.map(e => `${e.instancePath} ${e.message}`.trim()) }
}
export default validateJSON;