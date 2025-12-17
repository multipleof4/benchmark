export const validateJSON = async (data, schema) => {
  const { default: Ajv } = await import('https://cdn.jsdelivr.net/npm/ajv@8.12.0/+esm');
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);
  const isValid = validate(data);

  return {
    valid: isValid,
    errors: isValid ? [] : validate.errors.map(({ instancePath, message }) => 
      `${instancePath || 'root'} ${message}`.trim()
    )
  };
};
export default validateJSON;
// Generation time: 6.123s
// Result: PASS