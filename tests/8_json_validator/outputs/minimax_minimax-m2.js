export async function validateJSON(data, schema) {
  try {
    const AjvMod = await import('https://esm.sh/ajv@8.17.1');
    const FormatsMod = await import('https://esm.sh/ajv-formats@3.0.1?deps=ajv@8.17.1');
    const Ajv = AjvMod.default;
    const addFormats = FormatsMod.default;

    const ajv = new Ajv({ allErrors: true, strict: false, allowUnionTypes: true });
    addFormats(ajv);

    if (schema && typeof schema === 'object' && schema.$schema && typeof schema.$schema === 'string') {
      try { ajv.addMetaSchema(JSON.parse(schema.$schema)); } catch {}
    }

    const validate = ajv.compile(schema);
    const valid = validate(data);

    if (valid) return { valid: true, errors: [] };

    const errors = validate.errors.map(err => {
      const path = err.instancePath || '';
      const loc = path.replace(/\//g, '.').replace(/^\./, '') || 'root';
      let msg = `${loc} ${err.message}`;
      if (err.params) {
        const params = Object.assign({}, err.params);
        if (params.limit !== undefined) msg += ` (limit=${params.limit})`;
        if (params.type) msg += ` (type=${params.type})`;
        if (params.format) msg += ` (format=${params.format})`;
        if (params.pattern) msg += ` (pattern=${params.pattern})`;
        if (params.missingProperty) msg += ` (missingProperty=${params.missingProperty})`;
        if (params.additionalProperty) msg += ` (additionalProperty=${params.additionalProperty})`;
        if (params.existingCount !== undefined && params.allowedLength !== undefined) msg += ` (count=${params.existingCount}/${params.allowedLength})`;
      }
      return msg;
    });

    return { valid: false, errors };
  } catch (e) {
    return { valid: false, errors: [String(e && e.message || e)] };
  }
}
export default validateJSON;
// Generation time: 22.759s
// Result: PASS