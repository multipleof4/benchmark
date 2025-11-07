async function validateJSON(data, schema) {
  const { default: Ajv } = await import('https://cdn.skypack.dev/ajv@8?min');
  const { default: addFormats } = await import('https://cdn.skypack.dev/ajv-formats@2?min');
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const compile = s => {
    const c = ajv.compile(s);
    return d => ({ ok: c(d), errs: c.errors || [] });
  };
  const run = compile(schema);
  const r = run(data);
  if (r.ok) return { valid: true, errors: [] };
  const errors = r.errs.map(e => {
    const p = e.instancePath || e.dataPath || '';
    const loc = p || e.schemaPath || '';
    const msg = e.message || 'Invalid value';
    return loc ? loc + ' ' + msg : msg;
  });
  return { valid: false, errors };
}
export default validateJSON;