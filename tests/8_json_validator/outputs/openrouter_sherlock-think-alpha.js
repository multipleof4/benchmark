let ajvInstance;

async function validateJSON(data, schema) {
  if (!ajvInstance) {
    const { default: Ajv } = await import('https://cdn.skypack.dev/ajv@8');
    ajvInstance = new Ajv({ allErrors: true });
  }
  const ajv = ajvInstance;
  try {
    const validate = ajv.compile(schema);
    const valid = validate(data);
    const errors = valid ? [] : ajv.errorsText(validate.errors, { separator: '\n' })
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
    return { valid, errors };
  } catch (e) {
    return { valid: false, errors: [`Schema error: ${e.message}`] };
  }
}
export default validateJSON;