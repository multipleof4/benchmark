const validateJSON = async (jsonObject, schemaObject) => {
  try {
    const [{
      default: Ajv
    }, {
      default: addFormats
    }] = await Promise.all([
      import('https://esm.sh/ajv'),
      import('https://esm.sh/ajv-formats')
    ]);

    const ajv = new Ajv({
      allErrors: true
    });
    addFormats(ajv);

    const validate = ajv.compile(schemaObject);
    const valid = validate(jsonObject);

    const errors = valid ? [] : validate.errors.map(
      e => `${e.instancePath || '<root>'}: ${e.message}`
    );

    return {
      valid,
      errors
    };
  } catch (e) {
    return {
      valid: false,
      errors: [`Validation setup failed: ${e.message}`]
    };
  }
};
export default validateJSON;