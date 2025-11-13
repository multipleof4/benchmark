let ajvPromise;

const validateJSON = async (data, schema) => {
  const { default: Ajv } = await (ajvPromise ||= import('https://cdn.jsdelivr.net/npm/ajv@8.12.0/+esm'));

  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const valid = validate(data);

  const errors = valid ? [] : validate.errors.map(
    e => (`${e.instancePath || 'root'} ${e.message}`).trim()
  );

  return { valid, errors };
};
export default validateJSON;