const validateJSON = async (d, s) => {
  const { default: A } = await import('https://esm.sh/ajv@8.12.0')
  const v = new A({ allErrors: true }).compile(s)
  const b = v(d)
  return { valid: b, errors: b ? [] : v.errors.map(e => e.message) }
}
export default validateJSON;