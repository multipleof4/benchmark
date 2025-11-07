const validateJSON = async (data, schema) => {
  const { default: Ajv } = await import('https://cdn.jsdelivr.net/npm/ajv@8/dist/ajv.bundle.js');
  
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const valid = validate(data);
  
  return {
    valid,
    errors: valid ? [] : validate.errors.map(e => 
      `${e.instancePath || 'root'} ${e.message}`
    )
  };
};
export default validateJSON;