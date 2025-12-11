let _ajvP

const _ajv = async () => {
  if (_ajvP) return _ajvP
  _ajvP = (async () => {
    const [{ default: Ajv }, { default: addFormats }] = await Promise.all([
      import("https://esm.sh/ajv@8.12.0"),
      import("https://esm.sh/ajv-formats@2.1.1")
    ])
    const ajv = new Ajv({ allErrors: true, strict: false, allowUnionTypes: true })
    addFormats(ajv)
    return ajv
  })()
  return _ajvP
}

const _err = e => {
  let p = e.instancePath || ""
  let m = e.message || "is invalid"
  if (e.keyword === "required" && e.params?.missingProperty) {
    p += `/${e.params.missingProperty}`
    m = "is required"
  } else if (e.keyword === "additionalProperties" && e.params?.additionalProperty) {
    p += `/${e.params.additionalProperty}`
    m = "is not allowed"
  }
  return `${p || "/"} ${m}`.trim()
}

async function validateJSON(json, schema) {
  let ajv, v
  try { ajv = await _ajv() } catch (e) { return { valid: false, errors: [String(e?.message || e)] } }
  try { v = ajv.compile(schema) } catch (e) { return { valid: false, errors: [String(e?.message || e)] } }

  const valid = !!v(json)
  return { valid, errors: valid ? [] : (v.errors || []).map(_err) }
}
export default validateJSON;
// Generation time: 95.873s
// Result: PASS