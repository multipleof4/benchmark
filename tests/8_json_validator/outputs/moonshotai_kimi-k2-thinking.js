const cache = new WeakMap();
let ajv;

async function validateJSON(json, schema) {
  try {
    if (!ajv) {
      const { default: Ajv } = await import('https://cdn.jsdelivr.net/npm/ajv@8/dist/ajv.mjs');
      ajv = new Ajv({ allErrors: true, strict: false });
    }
    const validator = cache.get(schema) || (cache.set(schema, ajv.compile(schema)), cache.get(schema));
    const valid = validator(json);
    return { valid, errors: valid ? [] : validator.errors.map(e => `${e.instancePath} ${e.message}`.trim()) };
  } catch (error) {
    return { valid: false, errors: [error.message] };
  }
}
export default validateJSON;