export const validateJSON = async (data, schema) => {
  const Ajv = (await import('https://cdn.jsdelivr.net/npm/ajv@8.17.1/+esm')).default;
  const ajv = new Ajv({ 
    allErrors: true, 
    strict: false, 
    useDefaults: true 
  });

  const validate = ajv.compile(schema);
  const isValid = validate(data);

  return {
    valid: isValid,
    errors: isValid ? [] : validate.errors.map(err => ({
      path: err.instancePath || 'root',
      message: err.message,
      params: err.params
    }))
  };
};
export default validateJSON;
// Generation time: 10.003s
// Result: PASS