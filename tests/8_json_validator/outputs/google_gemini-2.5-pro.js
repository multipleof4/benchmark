const validateJSON = async (json, schema) => {
  let ajv;

  try {
    const { default: Ajv } = await import('https://cdn.jsdelivr.net/npm/ajv@8.17.1/+esm');
    ajv = new Ajv({ allErrors: true });
  } catch (e) {
    return { valid: false, errors: ["Failed to load validator: " + e.message] };
  }

  try {
    const validate = ajv.compile(schema);
    const valid = validate(json);

    const errors = validate.errors?.map(
      e => `${e.instancePath || 'root'} ${e.message}`.trim()
    ) ?? [];

    return { valid, errors };
  } catch (e) {
    return { valid: false, errors: ["Invalid schema: " + e.message] };
  }
};
export default validateJSON;