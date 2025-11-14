export async function validateJSON(data, schema) {
  const { default: Ajv } = await import('https://esm.sh/ajv@8?bundle');
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);
  const valid = validate(data);
  const errors = valid ? [] : (validate.errors || []).map(e => `${e.instancePath || '/'} ${e.message || ''}`.trim());
  return { valid, errors };
}
export default validateJSON;