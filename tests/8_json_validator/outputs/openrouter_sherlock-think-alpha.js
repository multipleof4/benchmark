const getAjv = async () => {
  if (!getAjv.instance) {
    const { default: Ajv } = await import('https://cdn.skypack.dev/ajv@8');
    getAjv.instance = new Ajv({ allErrors: true });
  }
  return getAjv.instance;
};

const validateJSON = async (data, schema) => {
  try {
    const ajv = await getAjv();
    const validate = ajv.compile(schema);
    const valid = validate(data);
    const errors = valid ? [] : ajv.errorsText(ajv.errors, { separator: '\n' }).split('\n').filter(s => s.trim());
    return { valid, errors };
  } catch (e) {
    return { valid: false, errors: [`Validation error: ${e.message}`] };
  }
};
export default validateJSON;