const validateJSON = async (data, schema) => {
  const { default: Ajv } = await import('https://esm.sh/ajv@8.17.1')
  const validator = new Ajv({ allErrors: true }).compile(schema)
  const valid = validator(data)
  return {
    valid,
    errors: valid ? [] : validator.errors.map(e => `${e.instancePath || 'root'} ${e.message}`)
  }
}
export default validateJSON;