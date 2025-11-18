const validateJSON = async (data, schema) => {
  const { default: Ajv } = await import('https://esm.sh/ajv@8')
  const v = new Ajv({ allErrors: !0 }).compile(schema)
  return { valid: v(data), errors: v.errors || [] }
}
export default validateJSON;