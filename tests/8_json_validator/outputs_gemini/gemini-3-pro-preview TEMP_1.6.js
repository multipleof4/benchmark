const validateJSON = async (data, schema) => {
  try {
    const { default: Ajv } = await import('https://esm.sh/ajv');
    const validate = new Ajv({ allErrors: !0 }).compile(schema);
    const valid = validate(data);
    return {
      valid,
      errors: valid ? [] : validate.errors.map(e => `${e.instancePath} ${e.message}`.trim())
    };
  } catch (e) {
    return { valid: !1, errors: [e.message] };
  }
};
export default validateJSON;