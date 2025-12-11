let _ajvP

const _getAjv = () =>
  _ajvP ||= (async () => {
    const [{ default: Ajv }, { default: addFormats }] = await Promise.all([
      import("https://cdn.jsdelivr.net/npm/ajv@8.17.1/dist/ajv.mjs"),
      import("https://cdn.jsdelivr.net/npm/ajv-formats@3.0.1/dist/ajv-formats.mjs")
    ])

    const ajv = new Ajv({
      allErrors: true,
      strict: false,
      allowUnionTypes: true,
      loadSchema: async u => (await fetch(u, { credentials: "same-origin" })).json()
    })

    addFormats(ajv)
    return ajv
  })()

const _fmtErr = e =>
  [e.instancePath || "/", e.message, e.params && Object.keys(e.params).length ? JSON.stringify(e.params) : ""]
    .filter(Boolean)
    .join(" ")

const validateJSON = async (data, schema) => {
  const ajv = await _getAjv()
  let validate

  try {
    validate = await ajv.compileAsync(schema)
  } catch {
    validate = ajv.compile(schema)
  }

  const valid = !!validate(data)
  const errors = valid ? [] : (validate.errors || []).map(_fmtErr)
  return { valid, errors }
}
export default validateJSON;
// Generation time: 12.999s
// Result: FAIL