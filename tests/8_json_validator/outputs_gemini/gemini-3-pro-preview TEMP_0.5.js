const validateJSON = async (data, schema) => {
  const Ajv = (await import('https://esm.sh/ajv@8.17.1')).default
  const validate = new Ajv({ allErrors: true }).compile(schema)
  const valid = validate(data)
  return { valid, errors: validate.errors?.map(e => e.message) ?? [] }
}
export default validateJSON;