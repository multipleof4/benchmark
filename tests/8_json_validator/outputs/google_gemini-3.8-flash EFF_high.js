export async function validateJSON(data, schema) {
  try {
    const { default: Ajv } = await import('https://esm.sh/ajv@8');
    const validate = new Ajv({ allErrors: true, strict: false }).compile(schema);
    const valid = !!validate(data);

    return {
      valid,
      errors: valid ? [] : validate.errors.map(e => e.instancePath ? `${e.instancePath} ${e.message}` : e.message)
    };
  } catch (err) {
    return {
      valid: false,
      errors: [err.message]
    };
  }
}
export default validateJSON;
// Generation time: 22.203s
// Result: PASS