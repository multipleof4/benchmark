async function validateJSON(data, schema) {
  const { default: Ajv } = await import('https://esm.sh/ajv@8');
  const v = new Ajv({ allErrors: true }).compile(schema);
  const isValid = v(data);
  return { valid: isValid, errors: isValid ? [] : v.errors.map(e => e.message) };
}
export default validateJSON;
// Generation time: 44.300s
// Result: PASS