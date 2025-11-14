const validateJSON = async (data, schema) => {
  try {
    const { default: Ajv } = await import('https://esm.sh/ajv@8');
    const validate = new Ajv({ allErrors: true }).compile(schema);
    const valid = validate(data);

    return {
      valid,
      errors: valid ? [] : (validate.errors ?? []).map(
        ({ instancePath, message }) => `${instancePath || 'root'} ${message}`.trim()
      ),
    };
  } catch (e) {
    return { valid: false, errors: [e.message] };
  }
};
export default validateJSON;