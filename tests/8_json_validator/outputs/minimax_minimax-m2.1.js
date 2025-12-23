async function validateJSON(data, schema) {
  const Ajv = (await import('https://cdn.jsdelivr.net/npm/ajv@8.12.0/dist/ajv2019.min.js')).default;
  
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);
  const valid = validate(data);
  
  if (valid) {
    return { valid: true, errors: [] };
  }
  
  const errors = validate.errors.map(error => {
    const message = `${error.instancePath} ${error.message}`;
    return error.params && error.params.allowedValues 
      ? `${message} (allowed: ${error.params.allowedValues.join(', ')})`
      : message;
  });
  
  return { valid: false, errors };
}
export default validateJSON;
// Generation time: 6.888s
// Result: FAIL