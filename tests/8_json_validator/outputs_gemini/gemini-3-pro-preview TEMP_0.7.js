const validateJSON = async (d, s) => {
  const { default: A } = await import('https://esm.sh/ajv@8')
  const v = new A({ allErrors: true }).compile(s)
  const r = v(d)
  return { valid: r, errors: r ? [] : v.errors.map(e => e.message) }
}
export default validateJSON;