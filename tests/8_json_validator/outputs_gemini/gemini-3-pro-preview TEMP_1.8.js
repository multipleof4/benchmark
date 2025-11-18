export const validateJSON = async (d, s) => {
  const { default: A } = await import('https://esm.sh/ajv@8.17.1');
  const v = new A({ allErrors: true }).compile(s);
  const valid = v(d);
  return {
    valid,
    errors: valid ? [] : v.errors.map(e => `${e.instancePath} ${e.message}`.trim())
  };
};
export default validateJSON;