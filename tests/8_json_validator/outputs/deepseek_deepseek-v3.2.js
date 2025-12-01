const validateJSON = async (json, schema) => {
  const { default: Ajv } = await import('https://cdn.skypack.dev/ajv@8.12.0');
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const valid = validate(json);
  return {
    valid,
    errors: valid ? [] : validate.errors.map(e => `${e.instancePath} ${e.message}`)
  };
};
export default validateJSON;
// Generation time: 4.839s
// Result: PASS