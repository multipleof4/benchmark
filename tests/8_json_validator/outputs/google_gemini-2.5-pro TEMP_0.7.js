const validateJSON = (() => {
  let ajvPromise;
  const validatorCache = new WeakMap();

  return async (json, schema) => {
    ajvPromise ||= import('https://cdn.jsdelivr.net/npm/ajv@8/dist/ajv2020.min.js')
      .then(({ default: Ajv }) => new Ajv({ allErrors: true }));

    const ajv = await ajvPromise;

    let validate = validatorCache.get(schema);
    if (!validate) {
      validate = ajv.compile(schema);
      validatorCache.set(schema, validate);
    }

    const valid = validate(json);
    const errors = valid ? [] : validate.errors.map(
      ({ instancePath, message }) => `${instancePath || 'object'} ${message}`
    );

    return { valid, errors };
  };
})();
export default validateJSON;