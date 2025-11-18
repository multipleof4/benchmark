const validateJSON = async (data, schema) => {
  const { default: Ajv } = await import('https://esm.sh/ajv@8');

  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const valid = validate(data);

  const errors = valid
    ? []
    : validate.errors.map(
        ({ instancePath, message }) => `${instancePath || 'object'} ${message}`.trim()
      );

  return { valid, errors };
};
export default validateJSON;