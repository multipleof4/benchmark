export async function validateJSON(data, schema) {
  const Ajv = (await import('https://esm.sh/ajv@8')).default;
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);
  const valid = Boolean(validate(data));
  const errors = valid 
    ? [] 
    : (validate.errors || []).map(e => `${e.instancePath || '#'} ${e.message}`);

  return { valid, errors };
}
export default validateJSON;
// Generation time: 8.566s
// Result: PASS