const validateJSON = async (data, schema) => {
  const { default: Ajv } = await import('https://esm.sh/ajv@8.12.0');
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const valid = validate(data);
  
  return {
    valid,
    errors: valid ? [] : validate.errors.map(err => 
      `${err.instancePath || '/'} ${err.message}`.trim()
    )
  };
};
export default validateJSON;