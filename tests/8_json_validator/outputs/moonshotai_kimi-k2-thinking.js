const validateJSON = async (data, schema) => {
  try {
    const { default: Ajv } = await import('https://esm.sh/ajv@8.12.0');
    const ajv = new Ajv({ allErrors: true, strict: false });
    try {
      const { default: addFormats } = await import('https://esm.sh/ajv-formats@2.1.1');
      addFormats(ajv);
    } catch {}
    
    const validate = ajv.compile(schema);
    const valid = validate(data);
    
    return {
      valid,
      errors: valid ? [] : validate.errors.map(e => {
        const path = (e.instancePath || 'root') + (e.keyword === 'required' ? `.${e.params.missingProperty}` : '');
        const pattern = e.params?.pattern ? ` (${e.params.pattern})` : '';
        return `${path} ${e.message}${pattern}`.trim();
      })
    };
  } catch (e) {
    return { valid: false, errors: [`Validator error: ${e.message}`] };
  }
};
export default validateJSON;