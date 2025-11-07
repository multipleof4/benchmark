const validateJSON = async (data, schema) => {
  const { default: Ajv } = await import('https://cdn.jsdelivr.net/npm/ajv@8.12.0/dist/2020.min.js');
  
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);
  const valid = validate(data);
  
  return {
    valid,
    errors: valid ? [] : validate.errors.map(e => ({
      path: e.instancePath || '/',
      message: e.message,
      keyword: e.keyword,
      params: e.params
    }))
  };
};
export default validateJSON;