const validateJSON = async (d, s) => {
  const { default: A } = await import('https://esm.sh/ajv@8')
  const v = new A({ allErrors: !0 }).compile(s), r = v(d)
  return { valid: r, errors: r ? [] : v.errors.map(e => e.message) }
}
export default validateJSON;