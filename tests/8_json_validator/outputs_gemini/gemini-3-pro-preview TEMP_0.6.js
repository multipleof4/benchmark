let a
const validateJSON = async (d, s) => {
  a ??= new (await import('https://esm.sh/ajv@8')).default({ allErrors: !0 })
  const v = a.compile(s), r = v(d)
  return { valid: r, errors: r ? [] : v.errors.map(e => `${e.instancePath} ${e.message}`.trim()) }
}
export default validateJSON;