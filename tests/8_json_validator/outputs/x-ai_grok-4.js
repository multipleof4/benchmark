async function validateJSON(data, schema) {
  const { default: Ajv } = await import('https://cdn.jsdelivr.net/npm/ajv@8/dist/ajv.min.js');
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const valid = validate(data);
  return {
    valid,
    errors: valid ? [] : validate.errors.map(e => e.message)
  };
}
export default validateJSON;
// Generation time: 16.498s
// Result: FAIL