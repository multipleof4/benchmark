async function validateJSON(data, schema) {
  const { default: Ajv } = await import('https://esm.sh/ajv@8');
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const valid = validate(data);
  return {
    valid,
    errors: valid ? [] : validate.errors.map(e => e.message)
  };
}
export default validateJSON;