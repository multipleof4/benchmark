let ajvPromise;
const compiledSchemas = new WeakMap();

const validateJSON = async (json, schema) => {
  try {
    ajvPromise ||= import('https://esm.sh/ajv@8').then(
      ({ default: Ajv }) => new Ajv({ allErrors: true })
    );
    const ajv = await ajvPromise;

    let validate = compiledSchemas.get(schema);
    if (!validate) {
      validate = ajv.compile(schema);
      compiledSchemas.set(schema, validate);
    }

    const valid = validate(json);
    const errors = valid
      ? []
      : (validate.errors ?? []).map(({ instancePath, message }) =>
          `${instancePath.substring(1) || 'root'}: ${message}`
        );

    return { valid, errors };
  } catch (error) {
    return {
      valid: false,
      errors: [error.message || 'An unknown validation error occurred.'],
    };
  }
};
export default validateJSON;