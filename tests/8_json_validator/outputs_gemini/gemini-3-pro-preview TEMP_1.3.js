const validateJSON = async (d, s) => {
  const { default: A } = await import('https://esm.sh/ajv@8.17.1')
  const v = new A({ allErrors: !0 }).compile(s)
  const r = v(d)
  return { valid: r, errors: r ? [] : v.errors }
}
export default validateJSON;